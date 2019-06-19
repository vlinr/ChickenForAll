/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
loadLib("fenbao/libs/laya.core.js")
loadLib("fenbao/libs/laya.particle.js")
loadLib("fenbao/libs/laya.ui.js")
//-----libs-end-------
loadLib("js/bundle.js");
