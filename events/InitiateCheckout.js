import rootStore from '@vue-storefront/store'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus/index'
import config from 'config'

export default (fbq, currency) => {
        EventBus.$on('checkout-after-created', async (data) => {

                const content_ids = []
                const contents = []
                let num_items = 0
                rootStore.state.cart.cartItems.forEach(item => {
                  content_ids.push(item.sku)
                  contents.push({
                      'id': item.sku,
                      'quantity': item.qty,
                      'item_price': item.priceInclTax
                  })
                  num_items += Number(item.qty)
                })
  
                fbq('track', 'InitiateCheckout', {
                        content_category: 'product',
                        content_type: 'product',
                        content_ids,
                        contents,
                        currency,
                        num_items,
                        value: rootStore.getters['cart/totals'][rootStore.getters['cart/totals'].length - 1].value
                })
  
                const cmsUrl = config.externalCheckout.cmsUrl
                if(cmsUrl) {
                        setTimeout(() => {
                                const langPath = rootStore.state.storeView.url ? rootStore.state.storeView.url.substr(1) + '/' : ''
                                window.location.replace(cmsUrl + langPath + 'vue/cart/sync/token/' + rootStore.state.user.token + '/cart/' + rootStore.state.cart.cartServerToken)   
                        }, 1000)
                } 
            })
}