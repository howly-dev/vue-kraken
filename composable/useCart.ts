import { onMounted, useMedusaClient } from "#imports";

export function useCart() {
  const client = useMedusaClient();

  const initCart = async () => {
    const cartId = localStorage.getItem("cart_id") || null;

    if (!cartId) {
      const { cart } = await client.carts.create();
      localStorage.setItem("cart_id", cart.id);
    } else {
      const { cart } = await client.carts.retrieve(cartId);
      console.log(cart);
    }
  };

  onMounted(() => initCart());
}
