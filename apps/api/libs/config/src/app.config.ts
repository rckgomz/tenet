export default () => ({
  name: 'tenet api',
  title: '',
  version: '1.0.0',
  port: parseInt(process.env.PORT, 10) || 8080,
  globalPrefix: 'api',
  defaultVersion: '1',
});
