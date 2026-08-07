import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  SRGBColorSpace,
} from 'three'
import { gsap } from 'gsap'

/**
 * The one WebGL effect on the site: the hero photograph, masked into a temple
 * arch, rippling away from the cursor and shearing with scroll velocity.
 *
 * Refuses to run — and tells the caller so, which swaps in a plain masked <img>
 * — when reduced motion is set, WebGL is unavailable, or the device looks
 * low-powered. A shader is never worth a janky first impression.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uTex;
  uniform vec2  uRes;
  uniform vec2  uTexRes;
  uniform vec2  uMouse;
  uniform float uTime;
  uniform float uVel;     // -1..1 scroll velocity
  uniform float uReveal;  // 0..1 entrance
  uniform float uFade;    // 1..0 handover to Act 2

  varying vec2 vUv;

  // Rectangle with a semicircular cap — a torana silhouette.
  float archSdf(vec2 p, float w, float h) {
    vec2 q = abs(vec2(p.x, p.y + h * 0.5)) - vec2(w, h * 0.5);
    float rect = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    float cap  = length(p - vec2(0.0, 0.0)) - w;
    return min(rect, cap);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    // --- cover-fit the photograph -------------------------------------
    vec2 ratio = vec2(
      min((uRes.x / uRes.y) / (uTexRes.x / uTexRes.y), 1.0),
      min((uRes.y / uRes.x) / (uTexRes.y / uTexRes.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // --- ripple away from the cursor ----------------------------------
    vec2 toMouse = vUv - uMouse;
    float d = length(toMouse * vec2(uRes.x / uRes.y, 1.0));
    float ripple = sin(d * 18.0 - uTime * 2.0) * exp(-d * 5.5) * 0.014;
    uv += normalize(toMouse + 1e-5) * ripple;

    // --- scroll velocity shear ----------------------------------------
    uv.x += uVel * 0.018 * (1.0 - abs(vUv.y - 0.5) * 2.0);

    vec3 col = texture2D(uTex, uv).rgb;

    // Push it toward the stage palette: lift the golds, sink the rest.
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(lum) * vec3(1.15, 0.92, 0.62), col, 0.72);

    // --- arch mask -----------------------------------------------------
    float aspect = uRes.x / uRes.y;
    vec2 p = (vUv - vec2(0.5, 0.46)) * vec2(aspect, 1.0);
    // Arch is narrower and taller on portrait viewports.
    float w = aspect < 0.9 ? 0.34 : 0.26;
    float h = aspect < 0.9 ? 0.52 : 0.44;
    float sdf = archSdf(p, w, h);
    float mask = 1.0 - smoothstep(0.0, 0.055, sdf);

    // A thin gold rim right on the arch edge.
    float rim = exp(-abs(sdf) * 90.0) * 0.5;
    col += vec3(0.83, 0.63, 0.09) * rim;

    // --- grain + vignette ----------------------------------------------
    col += (hash(vUv * uRes.xy + uTime) - 0.5) * 0.055;
    col *= 1.0 - smoothstep(0.35, 0.95, length((vUv - 0.5) * vec2(aspect, 1.0))) * 0.55;

    gl_FragColor = vec4(col, mask * uReveal * uFade);
  }
`

export interface ArchCanvasHandle {
  supported: Ref<boolean>
  ready: Ref<boolean>
  /** Drive the Act-2 handover fade, 1 = fully present. */
  setFade: (v: number) => void
  reveal: () => void
}

export function useArchCanvas(
  canvas: Ref<HTMLCanvasElement | null>,
  src: string,
): ArchCanvasHandle {
  const { reduced } = useMotionPreference()
  const supported = ref(false)
  const ready = ref(false)

  let renderer: WebGLRenderer | undefined
  let material: ShaderMaterial | undefined
  let tick: ((t: number) => void) | undefined
  let onResize: (() => void) | undefined
  let onPointer: ((e: PointerEvent) => void) | undefined

  const fade = { v: 1 }

  function capable() {
    if (reduced.value) return false
    // Anything this small is very likely to stutter; a static arch looks better.
    const cores = navigator.hardwareConcurrency ?? 8
    const mem = (navigator as { deviceMemory?: number }).deviceMemory ?? 8
    if (cores <= 4 || mem < 4) return false
    try {
      const c = document.createElement('canvas')
      return !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch {
      return false
    }
  }

  let observer: ResizeObserver | undefined

  onMounted(async () => {
    if (!capable() || !canvas.value) return
    supported.value = true

    // The canvas must have laid out before it can be sized. Reading clientWidth
    // in the same tick returns 0 and leaves a 0x0 drawing buffer that renders
    // nothing at all.
    await nextTick()

    const el = canvas.value
    if (!el) return

    const size = () => ({
      w: el.clientWidth || el.parentElement?.clientWidth || window.innerWidth,
      h: el.clientHeight || el.parentElement?.clientHeight || window.innerHeight,
    })

    renderer = new WebGLRenderer({ canvas: el, alpha: true, antialias: false })
    // Fill rate is the whole cost here — 1.5x is indistinguishable from 3x.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    {
      const { w, h } = size()
      renderer.setSize(w, h, false)
    }

    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

    material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      uniforms: {
        uTex: { value: null },
        uRes: { value: new Vector2(size().w, size().h) },
        uTexRes: { value: new Vector2(1600, 900) },
        uMouse: { value: new Vector2(0.5, 0.55) },
        uTime: { value: 0 },
        uVel: { value: 0 },
        uReveal: { value: 0 },
        uFade: { value: 1 },
      },
    })

    scene.add(new Mesh(new PlaneGeometry(2, 2), material))

    new TextureLoader().load(src, (tex) => {
      tex.colorSpace = SRGBColorSpace
      material!.uniforms.uTex.value = tex
      material!.uniforms.uTexRes.value.set(tex.image.width, tex.image.height)
      ready.value = true
      gsap.to(material!.uniforms.uReveal, { value: 1, duration: 1.6, ease: 'power2.out' })
    })

    // --- input -----------------------------------------------------------
    const mouseTarget = new Vector2(0.5, 0.55)
    onPointer = (e: PointerEvent) => {
      mouseTarget.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    onResize = () => {
      if (!renderer || !material) return
      const { w, h } = size()
      if (!w || !h) return
      renderer.setSize(w, h, false)
      material.uniforms.uRes.value.set(w, h)
    }
    window.addEventListener('resize', onResize, { passive: true })

    // Catches the case where the element gains its size after mount (fonts,
    // late layout, the curtain releasing) — `resize` alone would miss it.
    observer = new ResizeObserver(onResize)
    observer.observe(el)

    // --- render loop, sharing GSAP's ticker -------------------------------
    let lastScroll = window.scrollY
    tick = (time: number) => {
      if (!renderer || !material) return
      const u = material.uniforms

      u.uTime.value = time
      // Ease the cursor so the ripple trails rather than snaps.
      u.uMouse.value.lerp(mouseTarget, 0.08)

      const dy = window.scrollY - lastScroll
      lastScroll = window.scrollY
      u.uVel.value += (gsap.utils.clamp(-1, 1, dy / 60) - u.uVel.value) * 0.12

      u.uFade.value = fade.v

      // Nothing to show once Act 2 has taken over — stop burning frames.
      if (fade.v > 0.001) renderer.render(scene, camera)
    }
    gsap.ticker.add(tick)
  })

  onScopeDispose(() => {
    if (tick) gsap.ticker.remove(tick)
    if (onResize) window.removeEventListener('resize', onResize)
    if (onPointer) window.removeEventListener('pointermove', onPointer)
    observer?.disconnect()
    material?.dispose()
    renderer?.dispose()
  })

  return {
    supported,
    ready,
    setFade: (v: number) => {
      fade.v = v
    },
    reveal: () => {
      if (material) gsap.to(material.uniforms.uReveal, { value: 1, duration: 1.2 })
    },
  }
}
