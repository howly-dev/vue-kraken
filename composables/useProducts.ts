import { onMounted, computed } from 'vue'
import regions from "@/mocks/regions.json"

export function useProducts() {
    const client = useMedusaClient();

    const products = reactive([])
    const previewProducts = computed(() => {
        console.log('computed', products)
        return products.map((p) => transformProductPreview(p, regions[0]))
    })

    const fetchProducts = async () => {
        const response = await client.products.list();
        products.value = response.products
        console.log(response.products.map((p) => transformProductPreview(p, regions[0])))
    }

    onMounted(() => {
        fetchProducts()
    })

    return { products, previewProducts}
}
