import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageTitle from "../components/page-title";
import { useOrderDetailsQuery } from "../redux/api/orderAPI";
import { server } from "../redux/store";

const ORDER_STEPS = ["Processing", "Shipped", "Out for Delivery", "Delivered"] as const;

const OrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, isError } = useOrderDetailsQuery(id!);

    if (isLoading) return <div className="loader"><div /></div>;
    if (isError || !data?.order) {
        toast.error("Could not load order");
        return null;
    }

    const { order } = data;
    const isCancelled = order.status === "Cancelled";
    const currentStep = isCancelled ? -1 : ORDER_STEPS.indexOf(order.status as typeof ORDER_STEPS[number]);

    return (
        <div className="order-detail-page container">
            <PageTitle title={`Order ${order._id.slice(-6).toUpperCase()}`} />
            <h1>Order Details</h1>
            <p className="order-id">#{order._id}</p>

            <div className="status-stepper">
                {isCancelled ? (
                    <div className="stepper-cancelled">Order Cancelled</div>
                ) : (
                    ORDER_STEPS.map((step, i) => (
                        <div
                            key={step}
                            className={`step ${i <= currentStep ? "done" : ""} ${i === currentStep ? "active" : ""}`}
                        >
                            <div className="step-circle">{i < currentStep ? "✓" : i + 1}</div>
                            <span className="step-label">{step}</span>
                            {i < ORDER_STEPS.length - 1 && (
                                <div className={`step-line ${i < currentStep ? "done" : ""}`} />
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="order-detail-grid">
                <section className="order-items">
                    <h2>Items</h2>
                    {order.orderItems.map((item) => (
                        <div key={item._id} className="order-item-row">
                            <img src={`${server}/${item.photo}`} alt={item.name} />
                            <div>
                                <p>{item.name}</p>
                                <span>Qty: {item.quantity} × ₹{item.price}</span>
                            </div>
                            <strong>₹{item.quantity * item.price}</strong>
                        </div>
                    ))}
                </section>

                <aside className="order-summary-aside">
                    <section className="shipping-info">
                        <h2>Shipping</h2>
                        <p>{order.shippingInfo.address}</p>
                        <p>{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                        <p>{order.shippingInfo.country} – {order.shippingInfo.pinCode}</p>
                    </section>

                    <section className="price-breakdown">
                        <h2>Price Breakdown</h2>
                        <div className="price-row"><span>Subtotal</span><span>₹{order.subTotal}</span></div>
                        <div className="price-row"><span>Shipping</span><span>₹{order.shippingCharges}</span></div>
                        <div className="price-row"><span>Tax</span><span>₹{order.tax}</span></div>
                        {order.discount > 0 && (
                            <div className="price-row discount"><span>Discount</span><span>-₹{order.discount}</span></div>
                        )}
                        <div className="price-row total"><span>Total</span><strong>₹{order.total}</strong></div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default OrderDetail;
