/**
 *  api的baseUrl由protocol、hostname、port三段组成
 *  默认hostname、protocol、port会与当前的站点的一致
 *  这样在生产环境中使用时，只需要配置接口服务的商品port如8080
 *  多个域名下都可以使用
 */
export default function useApiBaseUrl() {
  if (
    import.meta.env.VITE_API_BASE_PROTOCOL ||
    import.meta.env.VITE_API_BASE_HOSTNAME ||
    import.meta.env.VITE_API_BASE_PORT
  ) {
    const protocol = import.meta.env.VITE_API_BASE_PROTOCOL || window.location.protocol
    const hostname = import.meta.env.VITE_API_BASE_HOSTNAME || window.location.hostname
    const port = import.meta.env.VITE_API_BASE_PORT || window.location.port
    const baseUrl = `${protocol}://${hostname}:${port}`
    // console.log('baseUrl', baseUrl)
    return  baseUrl
  }
  return ''
}
