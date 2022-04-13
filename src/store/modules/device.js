import { getStore, removeStore, setStore } from '@/util/store'
import { getPage } from '@/api/device/product'
import { fetchList as getDeviceList } from '@/api/device/instance'
import { getUnits } from '@/api/device/protocol'
import { groupBy } from 'lodash'
const size = 1000
const current = 1
const device = {
    state: {
        productAllList: getStore({ name: 'productAllList' }) || [],
        deviceAllList: getStore({ name: 'deviceAllList' }) || [],
        units: getStore({ name: 'units' }) || [],
    },
    actions: {
        getProductAllList ({ commit }) {
            return new Promise((resolve, reject) => {
                getPage({ size, current }).then(res => {
                    if (res.data.code == 0) {
                        commit('SET_PRODUCT_ALLLIST', res.data.data.records || [])
                        resolve(true)
                    }
                }).catch((err) => {
                    console.log('getProductAllList_error', err)
                })
            })
        },
        getDeviceAllList ({ commit }) {
            return new Promise((resolve, reject) => {
                getDeviceList({ size, current }).then(res => {
                    if (res.data.code == 0) {
                        commit('SET_DEVICE_ALLLIST', res.data.data.records || [])
                        resolve(true)
                    }
                }).catch((err) => {
                    console.log('getDeviceAllList_error', err)
                })
            })
        },
        getUnits ({ commit }) {
            return new Promise((resolve, reject) => {
                getUnits().then(res => {
                    let units = res.data.data
                    const grouped = groupBy(units, unit => unit.type)
                    const types = Array.from(new Set(units.map((unit) => {
                        return unit.type
                    })))
                    let unitlist = []
                    types.forEach(item => {
                        const obj = {
                            label: item,
                            groups: grouped[item]
                        }
                        unitlist.push(obj)
                    })
                    commit('SET_UNITS', unitlist || [])
                    resolve(true)
                }).catch((err) => {
                    console.log('getUnits_error', err)
                })
            })
        }
    },
    mutations: {
        SET_PRODUCT_ALLLIST: (state, Lists) => {
            state.productAllList = [...Lists]
            setStore({
                name: 'productAllList',
                content: Lists
            })
        },
        SET_DEVICE_ALLLIST: (state, Lists) => {
            state.deviceAllList = [...Lists]
            setStore({
                name: 'deviceAllList',
                content: Lists
            })
        },
        SET_UNITS: (state, Lists) => {
            state.units = [...Lists]
            setStore({
                name: 'units',
                content: Lists
            })
        }
    }

}

export default device
