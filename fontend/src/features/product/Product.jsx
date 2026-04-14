import { useEffect, useState } from "react";
import {
  addProduct,
  getFeeByIdProductService,
  getListProducts,
  updateProductService,
} from "./productService";
import { toast, ToastContainer } from "react-toastify";
import { Cog8ToothIcon, PlusIcon, QueueListIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import useStoreAuth from "../../zustand_store/storeAuth";
import { handleAPI } from "../../utils";

const Product = () => {
  const permissions = useStoreAuth((state) => state.permissions);
  const [listPro, setListPro] = useState([]);
  const [offsetState, setOffsetState] = useState(1);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const [valueAddProduct, setValueAddProduct] = useState({
    sellingPrice: 1,
    fee: 1,
    nameProduct: "",
    info: "",
    idProduct: null,
  });
  const [valueAddProductOld, setValueAddProductOld] = useState({
    sellingPrice: 1,
    fee: 1,
    nameProduct: "",
    info: "",
    idProduct: null,
  });
  const [disabledButtonUpdate, setDisabledButtonUpdate] = useState(true);

  const [isUpdateProduct, setIsUpdateProduct] = useState(false);

  useEffect(() => {
    const getListPro = async (limit = 10) => {
      const [res, err] = await handleAPI(
        getListProducts({ limit, offset: offsetState, search }),
      );

      if (err) {
        setListPro([]);
        const msg = err?.response?.data?.message || "Có lỗi nội bộ xảy ra";
        toast.error(msg);
        return;
      }
      setListPro(res.data);
    };
    getListPro();
  }, [offsetState]);
  const searchGetListProduct = async (limit = 10) => {
    if (isSearch === search) return;
    setIsSearch(search);
    const [res, error] = await handleAPI(
      getListProducts({ limit, offset: offsetState, search }),
    );

    if (error) {
      setListPro([]);
      return toast.error("Server error!");
    }

    setListPro(res.data);
  };
  const addProductForm = async () => {
    const [res, error] = await handleAPI(
      addProduct({
        ...valueAddProduct,
        nameProduct: valueAddProduct.nameProduct.trim(),
        info: valueAddProduct.info.trim(),
      }),
    );
    if (error) {
      const msg = error?.response?.data?.message;
      return toast.error(msg);
    }
    setOpen(false);
    toast.success(res.message);
  };
  const resetDateFormAddProduct = () => {
    setValueAddProduct({
      sellingPrice: 1,
      fee: 1,
      nameProduct: "",
      info: "",
    });
  };
  const getInfoAndFeeProduct = async (sellingPrice, nameProduct, id, info) => {
    const [res, error] = await handleAPI(
      getFeeByIdProductService({ idProduct: id }),
    );
    const value = {
      fee: 0,
      info,
      nameProduct,
      sellingPrice,
      idProduct: id,
    };
    if (!error) {
      value.fee = res.data.fee;
    } else {
      const msg = error?.response?.data?.message || "No found Product";
      toast.error(msg);
    }
    setValueAddProduct(value);
    setValueAddProductOld(value);
  };
  const checkFormUpdate = () => {
    if (
      valueAddProduct.fee != valueAddProductOld.fee ||
      valueAddProduct.sellingPrice != valueAddProductOld.sellingPrice ||
      valueAddProduct.nameProduct != valueAddProductOld.nameProduct ||
      valueAddProduct.info != valueAddProductOld.info
    ) {
      return true;
    }
    return false;
  };
  const updateInfoProduct = async () => {
    if (checkFormUpdate()) {
      const [res, error] = await handleAPI(
        updateProductService({
          ...valueAddProduct,
          nameProduct: valueAddProduct.nameProduct.trim(),
          info: valueAddProduct.info.trim(),
        }),
      );
      if (error) {
        const msg =
          error?.response?.data?.message ||
          "Đã xảy ra lỗi với cập nhật Product";
        return toast.error(msg);
      }
      setOpen(false);
      toast.success(res.message);
    } else {
      toast.info("Value not change!");
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-[#131f24] p-4 sm:p-8 text-white">
        {/* Header Section - Giống hệt style Debt */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-500/50">
              <QueueListIcon className="size-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Products Management
            </h1>
          </div>
          <p className="text-gray-400">
            Manage your inventory and product pricing
          </p>
        </div>

        {/* Search & Action Section */}
        <div className="mb-6 bg-[#1c2b33] rounded-xl border border-white/10 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                onChange={({ target: { value } }) => setSearch(value)}
                onKeyDown={(e) => e.key === "Enter" && searchGetListProduct()}
                value={search}
                className="w-full rounded-lg bg-[#131f24] px-4 py-3 text-base text-white outline-none border border-white/10 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="Search products..."
              />
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => searchGetListProduct()}
                className="px-6 cursor-pointer py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 transition shadow-lg shadow-blue-500/20"
              >
                Search
              </button>
              {permissions.includes("add_product") && (
                <button
                  onClick={() => {
                    setOpen(true);
                    resetDateFormAddProduct();
                    setIsUpdateProduct(false);
                  }}
                  className="flex items-center gap-2 px-6 cursor-pointer py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold hover:from-green-500 hover:to-green-400 transition shadow-lg shadow-green-500/20"
                >
                  <PlusIcon className="size-5" />
                  Add
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-[#1c2b33] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#21323b] border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">
                    Name Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">
                    Price
                  </th>
                  {permissions.includes("update_product") && (
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-100">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {listPro.map(({ sellingPrice, nameProduct, id, info }) => (
                  <tr
                    key={`list-product-${id}`}
                    className="border-b border-white/5 hover:bg-white/5 transition duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-gray-200 font-medium">
                      {nameProduct}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold">
                        {formatCurrency(sellingPrice)}
                      </span>
                    </td>
                    {permissions.includes("update_product") && (
                      <td className="px-6 py-4 text-sm text-center">
                        <button
                          onClick={() => {
                            setIsUpdateProduct(true);
                            setOpen(true);
                            getInfoAndFeeProduct(
                              sellingPrice,
                              nameProduct,
                              id,
                              info,
                            );
                          }}
                          className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-600 transition inline-flex items-center"
                        >
                          <Cog8ToothIcon className="size-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-900/50 border-t border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page{" "}
              <span className="font-semibold text-white">{offsetState}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setOffsetState(offsetState - 1)}
                disabled={offsetState <= 1}
                className="px-4 py-2 cursor-pointer rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={() => setOffsetState(offsetState + 1)}
                disabled={offsetState >= 1 && !listPro.length}
                className="px-4 py-2 cursor-pointer rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Dialog - Đồng bộ style với Debt Update */}
        <Dialog open={open} onClose={setOpen} className="relative z-50">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-2xl bg-[#1c2b33] text-left shadow-2xl border border-white/10 transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                {/* Dialog Header */}
                <div className="bg-[#131f24] p-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-500/50">
                      <PlusIcon className="size-6 text-blue-400" />
                    </div>
                    <DialogTitle
                      as="h3"
                      className="text-xl font-bold text-white"
                    >
                      {isUpdateProduct ? "Update Product" : "Add New Product"}
                    </DialogTitle>
                  </div>
                </div>

                {/* Dialog Body */}
                <div className="p-6 space-y-5 bg-[#1c2b33]">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Name Product
                      </label>
                      <input
                        onChange={(e) => {
                          setValueAddProduct({
                            ...valueAddProduct,
                            nameProduct: e.target.value,
                          });
                          setDisabledButtonUpdate(false);
                        }}
                        value={valueAddProduct.nameProduct}
                        className="w-full rounded-lg bg-[#131f24] px-4 py-2.5 text-white border border-white/10 focus:border-blue-500/50 outline-none transition"
                        placeholder="Enter name..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Fee
                        </label>
                        <input
                          type="number"
                          onChange={(e) => {
                            setValueAddProduct({
                              ...valueAddProduct,
                              fee: e.target.value,
                            });
                            setDisabledButtonUpdate(false);
                          }}
                          value={valueAddProduct.fee}
                          className="w-full rounded-lg bg-[#131f24] px-4 py-2.5 text-white border border-white/10 focus:border-blue-500/50 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Selling Price
                        </label>
                        <input
                          type="number"
                          onChange={(e) => {
                            setValueAddProduct({
                              ...valueAddProduct,
                              sellingPrice: e.target.value,
                            });
                            setDisabledButtonUpdate(false);
                          }}
                          value={valueAddProduct.sellingPrice}
                          className="w-full rounded-lg bg-[#131f24] px-4 py-2.5 text-white border border-white/10 focus:border-blue-500/50 outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Information
                      </label>
                      <textarea
                        rows="3"
                        onChange={(e) => {
                          setValueAddProduct({
                            ...valueAddProduct,
                            info: e.target.value,
                          });
                          setDisabledButtonUpdate(false);
                        }}
                        value={valueAddProduct.info}
                        className="w-full rounded-lg bg-[#131f24] px-4 py-2.5 text-white border border-white/10 focus:border-blue-500/50 outline-none transition resize-none"
                        placeholder="Product details..."
                      />
                    </div>
                  </div>
                </div>

                {/* Dialog Footer */}
                <div className="bg-[#131f24]/50 p-6 border-t border-white/5 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    onClick={() =>
                      isUpdateProduct ? updateInfoProduct() : addProductForm()
                    }
                    disabled={disabledButtonUpdate}
                    className="w-full sm:w-auto px-6 py-2.5 cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold hover:from-blue-500 transition disabled:opacity-50"
                  >
                    {isUpdateProduct ? "Save Changes" : "Create Product"}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full sm:w-auto mt-3 sm:mt-0 px-6 py-2.5 cursor-pointer rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition border border-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default Product;
