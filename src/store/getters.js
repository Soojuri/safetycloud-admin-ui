const getters = {
  tag: state => state.tags.tag,
  website: state => state.common.website,
  userInfo: state => state.user.userInfo,
  theme: state => state.common.theme,
  themeName: state => state.common.themeName,
  isShade: state => state.common.isShade,
  isCollapse: state => state.common.isCollapse,
  keyCollapse: (state, getters) => getters.screen > 1 ? getters.isCollapse : false,
  screen: state => state.common.screen,
  isLock: state => state.common.isLock,
  isFullScreen: state => state.common.isFullScreen,
  lockPasswd: state => state.common.lockPasswd,
  tagList: state => state.tags.tagList,
  tagWel: state => state.tags.tagWel,
  access_token: state => state.user.access_token,
  refresh_token: state => state.user.refresh_token,
  expires_in: state => state.user.expires_in,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  menu: state => state.user.menu,
  menuAll: state => state.user.menuAll,
  logsList: state => state.logs.logsList,
  logsLen: state => state.logs.logsList.length || 0,
  productAllList: state => state.device.productAllList,
  deviceAllList: state => state.device.deviceAllList,
  units: state => state.device.units,
  productDetailData: state => (id) => {
    return state.device.productAllList.filter(v => v.productId === id)
  },
  deviceDetailData: state => (id) => {
    return state.device.deviceAllList.filter(v => v.deviceId === id)
  },
  logsFlag: (state, getters) => getters.logsLen === 0,

}
export default getters
