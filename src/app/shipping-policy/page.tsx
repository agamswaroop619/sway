import React from "react";

const page = () => {
  return (
    <div className="m-10 text-[#7e7e7e]">
      <p className="my-4 text-white text-2xl font-semibold"> Shipping Policy</p>

      <p className="my-2 text-md">
        
        Thank you for shopping with Sway Clothing ! We aim to provide you with a
        seamless and enjoyable shopping experience. Please review our shipping
        policy below:
      </p>

      <p className="my-4 text-white text-2xl font-semibold">1. Processing Time: </p>

      <ul className="list-inside list-disc mx-2">
        <li className="my-2">
          Orders are typically processed and shipped within 4-5 business days
          after the order is placed, excluding weekends and holidays.
        </li>

        <li className="my-2">
          Orders with custom or personalized items may require additional
          processing time.{" "}
        </li>
      </ul>

      <p className="my-4 text-white text-2xl font-semibold">2. Shipping Methods: </p>

      <ul className="list-inside list-disc mx-2">
        <li className="my-2">
          We offer several shipping options, including standard shipping,
          expedited shipping.
        </li>

        <li className="my-2">
          Shipping costs and estimated delivery times are calculated at checkout
          based on the destination and selected shipping method.
        </li>
      </ul>

      <p className="my-4 text-white text-2xl font-semibold">3. Shipping Carriers: </p>

      <ul className="list-inside list-disc mx-2">
        <li className="my-2">
          We partner with trusted carrier Shiprocket to ensure reliable and
          timely delivery of your orders.
        </li>
        <li className="my-2">
          Once your order has been shipped, you will receive a confirmation
          email with tracking information to track your package.
        </li>
      </ul>

      <p className="my-4 text-white text-2xl font-semibold">4. Shipping Rates: </p>

      <ul className="mx-2">
        <li className="my-2">
          Shipping rates are determined based on the weight, size, and
          destination of your order.
        </li>
        <li className="my-2">
          Free shipping may be available for orders that meet specified
          criteria, such as order value or promotional offers.
        </li>
      </ul>
      <p className="my-4 text-white text-2xl font-semibold">5. Shipping Delays: </p>

      <ul className="list-inside list-disc mx-2">
        <li className="my-2">
          While we strive to deliver your orders on time, please understand that
          shipping delays may occur due to unforeseen circumstances such as
          weather conditions, carrier issues, or high order volumes.
        </li>
        <li className="my-2">
          We will do our best to notify you in advance of any anticipated delays
          and provide updates on the status of your order.
        </li>
      </ul>
      <p className="my-4 text-white text-2xl font-semibold">
        6. Order Tracking:
      </p>

      <ul className="list-inside list-disc mx-2">
        <li className="my-2">
          Once your order has shipped, you can track its progress using the
          tracking number provided in your shipping confirmation email.
        </li>
        <li className="my-2">
          If you have any questions or concerns about the status of your order,
          please don’t hesitate to contact our customer service team for
          assistance.
        </li>
      </ul>
      <p className="my-4 text-white text-2xl font-semibold">7. Shipping Address: </p>

      <ul className="list-inside list-disc mx-2">
        <li className="my-2">
          Please ensure that your shipping address is accurate and complete to
          avoid any delivery issues.
        </li>
        <li className="my-2">
          We are not responsible for orders shipped to incorrect or incomplete
          addresses provided by the customer.
        </li>
      </ul>
      <p className="my-4 text-2xl font-semibold text-white ">8. Order Changes and Cancellations: </p>

      <ul className="list-inside list-disc mx-2">
        <li className="my-4">
          If you need to make changes to your order or cancel it after it has
          been placed, please contact us as soon as possible.
        </li>
        <li className="my-4">
          Once an order has been processed and shipped, we are unable to make
          changes or cancel the order.
        </li>
      </ul>
      <p className="my-4 text-2xl font-semibold text-white">9. Returns and Exchanges: </p>

      <ul className="list-inside list-disc mx-2">
        <li className="my-2 ">
          For information about returns and exchanges, please refer to our
          Return Policy.(https://sway.club/refund_returns/)
        </li>

        <li className="my-2 ">
          If you have any further questions or concerns about our shipping
          policy, please feel free to contact our customer service team for
          assistance. Thank you for choosing Sway Clothing!
        </li>
      </ul>
    </div>
  );
};

export default page;
