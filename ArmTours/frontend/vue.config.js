module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((args) => {
      const defineArgs = args[0];
      defineArgs['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = true; 
      return [defineArgs];
    });
  },
};
