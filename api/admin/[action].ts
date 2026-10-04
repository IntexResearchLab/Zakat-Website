import deleteDonation from '../_routes/admin/delete-donation.js'
import recordDonation from '../_routes/admin/record-donation.js'
import resendReceipt from '../_routes/admin/resend-receipt.js'
import sendSignedReceipt from '../_routes/admin/send-signed-receipt.js'
import { routeByAction } from '../_lib/router.js'

export default routeByAction({
  'delete-donation': deleteDonation,
  'record-donation': recordDonation,
  'resend-receipt': resendReceipt,
  'send-signed-receipt': sendSignedReceipt,
})
