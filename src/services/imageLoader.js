const images = {};
const req = require.context("../assets/img", false, /\.(png|jpe?g|svg|gif)$/);
req.keys().forEach((key) => {
  const filename = key.replace(/^\.\//, "");
  images[filename] = req(key);
});
export default images;