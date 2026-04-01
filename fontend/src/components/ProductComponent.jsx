import { useEffect, useState } from "react";
import {
  addProduct,
  getFeeByIdProductService,
  getListProducts,
  updateProductService,
} from "../services/productService";
import { toast, ToastContainer } from "react-toastify";
import { Cog8ToothIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import useStoreAuth from "../zustand_store/storeAuth";
import { handleAPI } from "../utils";

const ProductComponent = () => {
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
    const [res, error] = await handleAPI(getListProducts({ limit, offset: offsetState, search }))

    if (error) {
      setListPro([])
      return toast.error('Server error!')
    }

    setListPro(res.data)

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
  return (
    <>
      <ToastContainer />

      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
        <div className="py-4 flex flex-col sm:flex-row sm:justify-between sm:itemessage-center gap-4">
          <div className="flex w-full sm:w-auto items-center gap-2">
            <input
              onChange={({ target: { value } }) => {
                setSearch(value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchGetListProduct();
                }
              }}
              value={search}
              className="w-full sm:w-[300px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Search products..."
            />
            <button
              onClick={() => {
                searchGetListProduct();
              }}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
            >
              Search
            </button>
          </div>
          {permissions.includes("add_product") && (
            <div className="flex w-full sm:w-auto justify-end">
              <button
                type="button"
                data-autofocus
                onClick={() => {
                  setOpen(true);
                  resetDateFormAddProduct();
                  setIsUpdateProduct(false);
                }}
                className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add
              </button>
            </div>
          )}
        </div>

        <table className="table-auto w-full border-collapse rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Name Product</th>
              <th className="px-6 py-3 text-left">Price</th>
              {permissions.includes("update_product") && (
                <th className="px-6 py-3 text-left">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {listPro.map(({ sellingPrice, nameProduct, id, info }) => {
              return (
                <tr
                  key={`list-product-${id}`}
                  className="bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{nameProduct}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sellingPrice}
                  </td>
                  {permissions.includes("update_product") && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Cog8ToothIcon
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
                        className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer transition"
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end items-center space-x-2 pt-4">
          <button
            onClick={() => setOffsetState(offsetState - 1)}
            disabled={offsetState <= 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-2 text-gray-800 font-medium">{offsetState}</span>
          <button
            onClick={() => setOffsetState(offsetState + 1)}
            disabled={offsetState >= 1 && !listPro.length}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <div>
        <Dialog open={open} onClose={setOpen} className="relative z-10">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
          />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
              >
                <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <div className="sm:flex sm:items-center">
                      <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-500/10 sm:mx-0 sm:size-10">
                        <PlusIcon
                          aria-hidden="true"
                          className="size-6 text-white"
                        />
                      </div>

                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <DialogTitle
                          as="h3"
                          className="text-base font-semibold text-white"
                        >
                          {isUpdateProduct ? "Update Product" : "Add Product"}
                        </DialogTitle>
                      </div>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <div className="pt-8 space-y-6">
                        <div>
                          <label
                            htmlFor="nameProduct"
                            className="block text-sm/6 font-medium text-gray-100"
                          >
                            Name Product :
                          </label>{" "}
                          <input
                            onChange={({ target: { value } }) => {
                              setValueAddProduct({
                                ...valueAddProduct,
                                nameProduct: value,
                              });
                              setDisabledButtonUpdate(false);
                            }}
                            value={valueAddProduct.nameProduct}
                            id="nameProduct"
                            placeholder="Name product ..."
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          ></input>
                        </div>
                        <div>
                          <label
                            htmlFor="fee"
                            className="block text-sm/6 font-medium text-gray-100"
                          >
                            Fee :
                          </label>{" "}
                          <input
                            onChange={({ target: { value } }) => {
                              setValueAddProduct({
                                ...valueAddProduct,
                                fee: value,
                              });
                              setDisabledButtonUpdate(false);
                            }}
                            value={valueAddProduct.fee}
                            id="fee"
                            min={1}
                            defaultValue={1}
                            type="number"
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          ></input>
                        </div>
                        <div>
                          <label
                            htmlFor="sellingPrice"
                            className="block text-sm/6 font-medium text-gray-100"
                          >
                            Selling Price :
                          </label>{" "}
                          <input
                            onChange={({ target: { value } }) => {
                              setValueAddProduct({
                                ...valueAddProduct,
                                sellingPrice: value,
                              });
                              setDisabledButtonUpdate(false);
                            }}
                            value={valueAddProduct.sellingPrice}
                            type="number"
                            min={1}
                            defaultValue={1}
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          ></input>
                        </div>
                        <div>
                          <label
                            htmlFor="info"
                            className="block text-sm/6 font-medium text-gray-100"
                          >
                            Info
                          </label>
                          <textarea
                            onChange={({ target: { value } }) => {
                              setValueAddProduct({
                                ...valueAddProduct,
                                info: value,
                              });
                              setDisabledButtonUpdate(false);
                            }}
                            placeholder="Info ..."
                            value={valueAddProduct.info}
                            id="info"
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {isUpdateProduct ? (
                    <button
                      type="button"
                      disabled={disabledButtonUpdate}
                      onClick={() => updateInfoProduct()}
                      className="inline-flex w-full cursor-pointer  justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addProductForm()}
                      className="inline-flex w-full cursor-pointer justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                    >
                      Add
                    </button>
                  )}
                  <button
                    type="button"
                    data-autofocus
                    onClick={() => {
                      setOpen(false);
                    }}
                    className="mt-3 inline-flex w-full cursor-pointer justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
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

export default ProductComponent;
