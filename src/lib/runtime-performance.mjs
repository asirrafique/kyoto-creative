/** Target the captured gradient renderer; leave Three.js and other scenes intact. */
export function optimizeBackgroundRuntime(text) {
  if (!text.includes('this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))')) return text;
  return text
    .replace('this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))', 'this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5))')
    // EffectComposer's RenderPass already draws this same scene. The direct
    // screen render was immediately overwritten by the composer output.
    .replace('this.renderer.render(this.scene,this.camera),this.composer.render()', 'this.composer.render()')
    .replace('render(){this.time+=.01', 'render(){if(this._disposed)return;this._frame=requestAnimationFrame(this._tick||(this._tick=this.render.bind(this)));if(document.hidden||!this.container.isConnected||this.container.style.opacity==="0")return;this.time+=.01')
    .replace(',requestAnimationFrame(this.render.bind(this))}', '}')
    .replace('setupResize(){window.addEventListener("resize",this.resize.bind(this))}', 'setupResize(){this._resize=this.resize.bind(this),window.addEventListener("resize",this._resize)}')
    .replace('destroy(){window.removeEventListener("resize",this.resize.bind(this))', 'destroy(){this._disposed=true,cancelAnimationFrame(this._frame),window.removeEventListener("resize",this._resize)');
}
