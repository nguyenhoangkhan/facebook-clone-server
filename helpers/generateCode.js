class Code {
  generateCode(length) {
    const schema = "0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += schema.charAt(Math.random() * schema.length);
    }
    return code;
  }
}
module.exports = new Code();
