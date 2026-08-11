import { gsap } from 'gsap'
import type { ShaderMaterial as TShaderMaterial, WebGLRenderer as TWebGLRenderer } from 'three'

// Three.js is imported dynamically, below, only after the capability check
// passes. Imported statically it lands in the entry chunk — ~135KB gzipped that
// every phone downloads and parses to run a shader most of them will decline.

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
    float aspect = uRes.x / uRes.y;

    // Where the arch sits on screen, and how big it is. Declared up here because the
    // texture pan below has to know, and the mask further down reuses them.
    //
    // On landscape the arch sits right of centre, clearing the headline column.
    // Centred, it sat directly under the h1 — which the dark theme got away with
    // (light type over a dark photo) and the light theme does not: ink type over a
    // dark stage photograph disappears. Portrait keeps it centred, where the type is
    // scrimmed instead; there is no width to give away on a phone.
    float cx = aspect < 0.9 ? 0.5 : 0.68;
    float w  = aspect < 0.9 ? 0.34 : 0.26;
    float h  = aspect < 0.9 ? 0.52 : 0.44;

    // --- cover-fit the photograph -------------------------------------
    vec2 ratio = vec2(
      min((uRes.x / uRes.y) / (uTexRes.x / uTexRes.y), 1.0),
      min((uRes.y / uRes.x) / (uTexRes.y / uTexRes.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // --- pan the photograph so the ARCH frames the subject -------------
    //
    // The cover-fit above centres the image on the whole canvas, but the arch is a
    // small window onto it — 26% of the width — and it is not in the middle. Moving
    // the arch right therefore slid the visible crop onto the right of the frame:
    // the standing dancer sits at 51% across and 45% down, so he fell out of shot
    // and the arch filled with the kneeling dancers behind him.
    //
    // FOCUS is the point of the texture, in uv space (y measured from the bottom),
    // that should land at the centre of the arch. Solving for the offset:
    //   arch centre samples  archCentre * ratio + (1 - ratio) * 0.5
    //   so shift uv by       FOCUS - that
    // which is zero when the arch is centred, and grows as it moves off centre.
    const vec2 FOCUS = vec2(0.5, 0.55);
    vec2 archCentre = vec2(cx, 0.46 - h * 0.5 + w * 0.5);
    uv += FOCUS - (archCentre * ratio + (1.0 - ratio) * 0.5);

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
    // aspect, cx, w and h are declared at the top of main(), because the texture pan
    // needs them before this point. (No backticks in here: the shader is a template
    // literal, and one would end the string.)
    vec2 p = (vUv - vec2(cx, 0.46)) * vec2(aspect, 1.0);
    float sdf = archSdf(p, w, h);
    // Edge width is ~2px, not 0.055.
    //
    // The old soft edge faded alpha out over a wide band, which on the dark stage
    // read as a glow — dark photo over near-black. Against the light page the same
    // band is dark pixels smeared onto white: a grimy halo around the arch. This is
    // narrow enough to kill the halo and still wide enough to anti-alias the cap.
    float mask = 1.0 - smoothstep(0.0, 0.004, sdf);

    // A thin gold rim right on the arch edge.
    float rim = exp(-abs(sdf) * 90.0) * 0.5;
    col += vec3(0.83, 0.63, 0.09) * rim;

    // --- grain + vignette ----------------------------------------------
    col += (hash(vUv * uRes.xy + uTime) - 0.5) * 0.055;
    // Vignette eased off: at 0.55 the arch's lower corners went to near-black, which
    // was the point on a black stage and reads as sludge against white.
    col *= 1.0 - smoothstep(0.35, 0.95, length((vUv - 0.5) * vec2(aspect, 1.0))) * 0.30;

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

  let renderer: TWebGLRenderer | undefined
  let material: TShaderMaterial | undefined
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

    // Paid for only where it will actually be used.
    const {
      Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial,
      TextureLoader, Vector2, WebGLRenderer, SRGBColorSpace,
    } = await import('three')

    // The component can unmount while that chunk is in flight.
    if (!canvas.value) return

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
