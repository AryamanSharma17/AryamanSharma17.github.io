import * as THREE from "three";

/**
 * Returns a custom ShaderMaterial that renders Gaussian splats as soft elliptical billboards.
 */
export function getSplatMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSize: { value: 0.05 },
    },
    vertexShader: `
      uniform float uSize;
      varying vec3 vColor;
      attribute vec3 color;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = uSize * (300.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float r = length(gl_PointCoord - 0.5);
        float alpha = exp(-16.0 * r * r);
        gl_FragColor = vec4(vColor, alpha);
      }
    `
  });
}
