import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import { RootState } from "../../redux/store";
import { SkeletonLoader } from "../../components/loader";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}


const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {

  const {user} = useSelector((state: RootState) => state.userReducer);

  const {isLoading, data, isError, error } = useAllOrdersQuery(user?._id!);
  
  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data) setRows(data.orders.map(order => (
      {
        user:  order.user.name,
        amount: order.total,
        discount: order.discount,
        quantity: order.orderItems.length,
        status: (<span
          className={
            order.status === "Processing" ? "red"
            : order.status === "Shipped" ? "green"
            : "purple"
          }>
        {order.status}
        </span>),
        action: (<Link to={`/admin/transaction/${order._id}`}> Manage </Link>),
      }
    )));
  }, [data]);


  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <SkeletonLoader length={20}/> :Table}</main>
    </div>
  );
};

export default Transaction;
