import details from '../_routes/receipts/details.js'
import pdf from '../_routes/receipts/pdf.js'
import requestSigned from '../_routes/receipts/request-signed.js'
import { routeByAction } from '../_lib/router.js'

export default routeByAction({
  details,
  pdf,
  'request-signed': requestSigned,
})
