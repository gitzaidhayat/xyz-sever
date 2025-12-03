import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Loader from "../../components/common/Loader";
import { FiCalendar, FiX } from "react-icons/fi";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    customerName: "",
    dateFrom: "",
    dateTo: "",
    orderMethod: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (filterParams = {}) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      Object.keys(filterParams).forEach((key) => {
        if (filterParams[key]) {
          params.append(key, filterParams[key]);
        }
      });

      const data = await adminApi.getAllOrders(params.toString());
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchOrders(filters);
    setShowFilter(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      customerName: "",
      dateFrom: "",
      dateTo: "",
      orderMethod: "",
    };
    setFilters(emptyFilters);
    fetchOrders(emptyFilters);
  };

  const downloadOrders = (order) => {
    // Create PDF with thermal printer size (75mm x 125mm)
    // Convert mm to points: 1mm = 2.83465 points
    const width = 75 * 2.83465; // 212.6 points
    const height = 125 * 2.83465; // 354.3 points
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [width, height]
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = 15;

    // Helper function to add text
    const addText = (text, x, size = 8, style = 'normal', align = 'left') => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      if (align === 'center') {
        doc.text(text, pageWidth / 2, y, { align: 'center' });
      } else {
        doc.text(text, x, y);
      }
      y += size + 3;
    };

    // Header
    addText('STD', margin, 10, 'bold');
    doc.setFontSize(7);
    doc.text('I-Kart Logistics', margin + 25, 15);
    doc.text('OD432660259738302100', margin + 25, 22);
    doc.text('PREPAID', pageWidth - margin - 35, 15);
    
    // Box around header
    doc.rect(margin, 10, pageWidth - 2 * margin, 20);
    y = 35;

    // Flipkart logo section
    addText('Ordered through', margin, 7);
    addText('Flipkart', margin, 10, 'bold');
    
    // Barcode for order ID
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, order.orderId || order._id.slice(-12), {
      format: 'CODE128',
      width: 1,
      height: 40,
      displayValue: false
    });
    const barcodeImg = canvas.toDataURL('image/png');
    doc.addImage(barcodeImg, 'PNG', margin, y, 60, 30);
    y += 35;

    // QR Code placeholder (you can use a QR library for actual QR)
    doc.rect(pageWidth - margin - 50, 40, 50, 50);
    addText('QR', pageWidth - margin - 35, 8);
    y = 95;

    // Shipping Address
    doc.setDrawColor(0);
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, pageWidth - 2 * margin, 8, 'F');
    addText('Shipping/Customer address:', margin + 2, 7, 'bold');
    
    const name = order.customerName || order.shippingAddress?.fullName || 'N/A';
    const address = order.shippingAddress?.street || order.shippingAddress?.address || '';
    const city = order.shippingAddress?.city || '';
    const state = order.shippingAddress?.state || '';
    const zipCode = order.shippingAddress?.zipCode || '';
    const phone = order.shippingAddress?.phone || '';
    
    addText(`Name: ${name}`, margin, 7);
    
    // Split long address
    const addressLines = doc.splitTextToSize(address, pageWidth - 2 * margin - 10);
    addressLines.forEach(line => {
      addText(line, margin, 7);
    });
    
    addText(`${city}, ${state}`, margin, 7);
    addText(`Patna - ${zipCode}, IN-BR`, margin, 7);
    y += 3;

    // AWB/CPD section
    addText(`AWB: ${order.orderId || 'N/A'}`, margin, 7, 'bold');
    addText(`CPD: 03 - 11`, margin, 7);
    y += 3;

    // Seller info
    addText('S:M/s Ultralabz Ventures,', margin, 6);
    addText('NEAR RESHARE FITNESS, MAHADEV TALAR', margin, 6);
    addText('ROAD,, NEAR BY GIRISH PUBLIC SCHOOL, GIRIDIH', margin, 6);
    addText('JHARKHAND, GIRIDIH - 815301', margin, 6);
    addText('GST: 20AAIFU3374R1ZQ', margin, 6);
    y += 5;

    // Product details
    doc.setDrawColor(0);
    doc.rect(margin, y, pageWidth - 2 * margin, 12);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('SKU ID | Description', margin + 2, y + 8);
    doc.text('QTY', pageWidth - margin - 15, y + 8);
    y += 12;

    // Product items
    order.items?.forEach((item, index) => {
      if (index < 2) { // Limit to 2 items for space
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        const productText = `${item.product?.name || 'Product'} | ${item.product?.title || ''}`;
        const lines = doc.splitTextToSize(productText, pageWidth - 2 * margin - 30);
        lines.forEach(line => {
          doc.text(line, margin + 2, y + 6);
          y += 7;
        });
        doc.text(String(item.quantity), pageWidth - margin - 15, y - 1);
        y += 2;
      }
    });

    y += 5;

    // Barcode at bottom
    const canvas2 = document.createElement('canvas');
    JsBarcode(canvas2, `FMIP${order._id.slice(-9)}`, {
      format: 'CODE128',
      width: 1.5,
      height: 35,
      displayValue: true,
      fontSize: 10
    });
    const barcode2 = canvas2.toDataURL('image/png');
    doc.addImage(barcode2, 'PNG', margin, y, pageWidth - 2 * margin, 30);
    y += 35;

    // Tax Invoice section
    doc.setFillColor(255, 255, 255);
    doc.rect(0, y, pageWidth, 2, 'F');
    y += 5;

    addText('Tax Invoice', margin, 9, 'bold');
    doc.setFontSize(6);
    doc.text(`Order Id: ${order.orderId || order._id}`, margin, y);
    doc.text(`Order Date: ${formatDate(order.createdAt)}`, margin, y + 7);
    y += 20;

    // Sold By section
    addText('Sold By', margin, 7, 'bold');
    addText('M/s Ultralabz Ventures', margin, 6);
    y += 5;

    // Shipping and Billing Address
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('Shipping ADDRESS', margin, y);
    doc.text('Billing Address', pageWidth/2 + 5, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.text(name, margin, y);
    doc.text(name, pageWidth/2 + 5, y);
    y += 7;
    doc.text(address.substring(0, 30), margin, y);
    doc.text(address.substring(0, 30), pageWidth/2 + 5, y);
    y += 7;
    doc.text(`${city}, ${state} - ${zipCode}`, margin, y);
    doc.text(`${city}, ${state} - ${zipCode}`, pageWidth/2 + 5, y);
    y += 7;
    doc.text(`Patna - ${zipCode}, IN-BR`, margin, y);
    doc.text(`Patna - ${zipCode}, IN-BR`, pageWidth/2 + 5, y);
    y += 15;

    // Product Table
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    const colWidths = [60, 35, 15, 20, 15, 15, 15];
    let xPos = margin;
    ['Product', 'Description', 'Qty', 'Gross Amount', 'Discount', 'Taxable Value', 'IGST', 'CESS', 'Total'].forEach((header, i) => {
      doc.text(header, xPos, y);
      xPos += colWidths[i] || 15;
    });
    y += 8;

    // Product row
    doc.setFont('helvetica', 'normal');
    if (order.items && order.items.length > 0) {
      const item = order.items[0];
      xPos = margin;
      doc.text(item.product?.name?.substring(0, 20) || 'Product', xPos, y);
      xPos += colWidths[0];
      doc.text('Item description', xPos, y);
      xPos += colWidths[1];
      doc.text(String(item.quantity), xPos, y);
      xPos += colWidths[2];
      doc.text((item.price * item.quantity).toFixed(2), xPos, y);
      xPos += colWidths[3];
      doc.text('0.00', xPos, y);
      xPos += colWidths[4];
      doc.text(item.price.toFixed(2), xPos, y);
      xPos += colWidths[5];
      doc.text('0.00', xPos, y);
      xPos += colWidths[6];
      doc.text('0.00', xPos, y);
      y += 7;
    }

    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL QTY: ${order.items?.reduce((sum, item) => sum + item.quantity, 0) || 1}`, margin, y);
    doc.text(`TOTAL PRICE: ${order.totalAmount?.toFixed(2) || '0.00'}`, pageWidth - margin - 60, y);

    // Footer
    y += 10;
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.text('Ordered Through', pageWidth/2, y, { align: 'center' });
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Flipkart', pageWidth/2, y, { align: 'center' });
    doc.text('M/s Ultralabz Ventures', pageWidth - margin - 40, y);

    // Save PDF
    doc.save(`Order_${order.orderId || order._id}_Receipt.pdf`);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      // Refresh orders after status update
      fetchOrders(filters);
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New Order":
        return "bg-yellow-50 text-yellow-600 border border-yellow-200";
      case "Accepted by Restaurant":
        return "bg-green-50 text-green-600 border border-green-200";
      case "Prepared":
        return "bg-orange-50 text-orange-600 border border-orange-200";
      case "Rejected by Store":
        return "bg-red-50 text-red-600 border border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Orders Management
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage all customer orders
            </p>
          </div>
        </div>

        <div className="p-8">
          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={filters.customerName}
                    onChange={handleFilterChange}
                    placeholder="Enter customer name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date from
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateFrom"
                      value={filters.dateFrom}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date to
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateTo"
                      value={filters.dateTo}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Methods
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          orderMethod:
                            prev.orderMethod === "Delivery" ? "" : "Delivery",
                        }))
                      }
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        filters.orderMethod === "Delivery"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Delivery
                    </button>
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          orderMethod:
                            prev.orderMethod === "Pickup" ? "" : "Pickup",
                        }))
                      }
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        filters.orderMethod === "Pickup"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Pickup
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          {isLoading ? (
            <Loader fullScreen={false} />
          ) : (
            <div
              className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
              style={{ height: "calc(100vh - 280px)" }}
            >
              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500 text-lg">No orders found</p>
                  <p className="text-gray-400 mt-2">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full">
                      <thead className="bg-[#2c3e50] text-white sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Order Id
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Recipt
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Payment Id
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Products
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Phone Number
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Address
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Pincode
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Total Amount
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            User Id
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Order Status
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Date Created
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.map((order, index) => (
                          <tr
                            key={order._id}
                            className={`${
                              index % 2 === 0 ? "bg-[#34495e]" : "bg-[#2c3e50]"
                            } text-white hover:bg-[#3d5a80] transition-colors`}
                          >
                            <td className="px-6 py-4">
                              <span className="text-sm text-blue-300">
                                {order.orderId || order._id.slice(-6)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => downloadOrders(order)}
                                className="px-4 py-2 border border-gray-300 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Download
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-green-300">
                                {order.paymentMethod === "COD"
                                  ? "pay_"
                                  : "pay_"}
                                {Math.random().toString(36).substring(2, 15)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-sm text-blue-400 hover:text-blue-300 underline">
                                Click here to view
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm">
                                {order.customerName ||
                                  order.shippingAddress?.fullName ||
                                  "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm flex items-center gap-1">
                                <span>📞</span>
                                {order.shippingAddress?.phone ||
                                  order.customerPhone ||
                                  "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm max-w-xs truncate block">
                                {order.shippingAddress?.street ||
                                  order.shippingAddress?.address ||
                                  "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm">
                                {order.shippingAddress?.zipCode || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm">
                                ₹ {order.totalAmount?.toFixed(2) || "0.00"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-blue-300">
                                {order.user?.email ||
                                  order.customerEmail ||
                                  "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-300">
                                {order.user?._id?.slice(-12) ||
                                  order.user ||
                                  "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusChange(order._id, e.target.value)
                                }
                                className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirm">Confirm</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="None">None</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <div className="flex items-center gap-1">
                                  <span>📅</span>
                                  {formatDate(
                                    order.createdAt || order.orderDate
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination - Fixed at bottom */}
                  <div className="bg-[#2c3e50] px-6 py-4 flex items-center justify-between border-t border-gray-600 sticky bottom-0 z-10">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <span>Rows per page:</span>
                      <select className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-4 text-white text-sm">
                      <span>1-10 of {orders.length}</span>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <span>◄</span>
                        </button>
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <span>►</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
