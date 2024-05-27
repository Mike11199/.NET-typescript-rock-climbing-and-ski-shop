import UserOrdersPageComponent from "./components/UserOrdersPageComponent";
import axios from "axios";

const getOrders = async () => {
  const { data } = await axios.get("/apiv2/orders");
  return data;
};

const UserOrdersPage = () => {
  return <UserOrdersPageComponent getOrders={getOrders} />;
};

export default UserOrdersPage;
