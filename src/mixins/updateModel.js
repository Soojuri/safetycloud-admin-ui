import { putObj } from '@/api/device/product'
import { mapActions } from 'vuex'
export default {
    data () {
        return {}
    },
    methods: {
        ...mapActions(['getProductAllList']),
        updateDeviceList (productId, metadata, text) {
            return new Promise((resolve, reject) => {
                putObj({ productId, metadata }).then(res => {
                    if (res.data.data) {
                        this.msgSuccess(text + '成功')
                        this.getProductAllList().then((res) => {
                            resolve(true)
                        })
                    } else {
                        reject(this.msgSuccess(text + '失败成功'))
                    }
                })
            })
        }
    }
}