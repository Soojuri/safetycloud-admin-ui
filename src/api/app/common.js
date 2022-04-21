import {
  uploadAction
} from '@/api/manage'

const uploadFile = (params) => uploadAction('/admin/sys-file/upload', params);

export {
  uploadFile
}
