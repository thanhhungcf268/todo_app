import { useEffect, useState, Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  PlusIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,

} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  getListDebtService,
  getListDebtByUserService,
} from "./debtService";

const Debt = () => {
  const [listDebt, setListDebt] = useState([]);
  const [offsetState, setOffsetState] = useState(1);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState("");
  const [valueEditDebts, setValueEditDebts] = useState([
    {
      nameProduct: "",
      quantityProduct: 0,
      priceProduct: 0,
      debtsPaid: 0,
      note: "",
    },
  ]);

  const [listDebtByUser, setListDebtByUser] = useState([]);

  // const [disabledButtonUpdate, setDisabledButtonUpdate] = useState(true);

  useEffect(() => {
    const getListDebts = (limit = 10) => {
      getListDebtService({ limit, offset: offsetState, search })
        .then(({ data, status }) => {
          if (status === "success") {
            const newData = data.map((value) => {
              return {
                ...value,
                remainingDebt: value.totalDebt - value.DebtPaid,
              };
            });
            return setListDebt(newData);
          }
          setListDebt([]);
        })
        .catch(() => {
          toast.error("Server error");
        });
    };
    getListDebts();
  }, [offsetState]);

  const searchListDebts = (limit = 10) => {
    if (isSearch === search) return;
    setIsSearch(search);
    getListDebtService({ limit, offset: offsetState, search })
      .then(({ data, status }) => {
        if (status === "success") {
          const newData = data.map((value) => {
            return {
              ...value,
              remainingDebt: value.totalDebt - value.DebtPaid,
            };
          });
          return setListDebt(newData);
        }
        setListDebt([]);
      })
      .catch(() => {
        toast.error("Server error");
      });
  };

  const updateDebt = async () => {
    console.log("Update debt with values:", valueEditDebts);
  };

  const getListDebtsByUser = async (idUser) => {
    try {
      const { data, status } = await getListDebtByUserService(idUser);
      if (status === "success") {
        setListDebtByUser(data);
        return;
      }
      toast.error("Failed to fetch debt details for the user.");
    } catch (error) {
      console.error("Error fetching debt details:", error);
      toast.error("An error occurred while fetching debt details.");
    }
  };

  const toggleDropdown = () => {
    const menu = document.getElementById("dropdownMenu");
    menu.classList.toggle("hidden");
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
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-500/50">
              <CreditCardIcon className="size-6 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Debt Management</h1>
          </div>
          <p className="text-gray-400">
            Track and manage all your debts in one place
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-6 bg-[#1c2b33] rounded-xl border border-white/10 p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                onChange={({ target: { value } }) => {
                  setSearch(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchListDebts();
                  }
                }}
                value={search}
                // w-full rounded-lg bg-[#131f24] px-4 py-3 border border-white/10
                className="w-full rounded-lg bg-[#131f24] px-4 py-3 border border-white/10 placeholder:text-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition"
                placeholder="Search by name..."
              />
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
            </div>
            <button
              onClick={() => {
                searchListDebts();
              }}
              className="px-6 cursor-pointer py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold hover:from-green-500 hover:to-green-400 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-[#1c2b33] rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#21323b] border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100"></th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">
                    Total Debt
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">
                    Debts Paid
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">
                    Remaining
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">
                    Paid
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {listDebt.map((value) => (
                  <Fragment key={`list-debt-${value.id}`}>
                    <tr className="border-b border-gray-700/30 hover:bg-gray-700/30 transition duration-200">
                      <td className="text-sm px-6 py-4">
                        <PlusIcon
                          id="dropdownButton"
                          onClick={toggleDropdown}
                          aria-hidden="true"
                          className="size-7 cursor-pointer text-green-400"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {value.fullName ||
                          value.phoneNumber ||
                          value.email ||
                          "Unknown User"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-semibold">
                          {formatCurrency(value.totalPrice)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold">
                          {formatCurrency(value.totalPaid)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold">
                          {formatCurrency(value.totalRemaining)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            setOpenView(true);
                            getListDebtsByUser(value.id);
                          }}
                          className="cursor-pointer  px-4 mt-2 py-2 rounded-lg bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 border border-blue-500/50 font-semibold transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setOpen(true);
                          }}
                          className="cursor-pointer  px-4 sm:ml-2 ml-0 mt-2 py-2 rounded-lg bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 border border-blue-500/50 font-semibold transition"
                        >
                          Edit
                        </button>
                        {/* <button
                          onClick={() => {
                            setOpen(true);
                          }}
                          className="cursor-pointer  px-4 sm:ml-2 ml-0 mt-2 py-2 rounded-lg bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 border border-blue-500/50 font-semibold transition"
                        >
                          Add debt
                        </button> */}
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-900/50 border-t border-gray-700/50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page{" "}
              <span className="font-semibold text-white">{offsetState}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setOffsetState(offsetState - 1)}
                disabled={offsetState <= 1}
                className="px-4 py-2 cursor-pointer  rounded-lg bg-gray-700/50 text-gray-200 hover:bg-gray-700 border border-gray-600/50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={() => setOffsetState(offsetState + 1)}
                disabled={offsetState >= 1 && !listDebt.length}
                className="px-4 py-2 cursor-pointer  rounded-lg bg-gray-700/50 text-gray-200 hover:bg-gray-700 border border-gray-600/50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <div>
        <Dialog open={open} onClose={setOpen} className="relative z-10">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
          />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-2xl bg-[#1c2b33] text-left shadow-2xl border border-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-3xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
              >
                {/* Dialog Header */}
                <div className="bg-[#131f24] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-500/50">
                      <PlusIcon
                        aria-hidden="true"
                        className="size-7 text-green-400"
                      />
                    </div>
                    <div className="flex-1">
                      <DialogTitle
                        as="h3"
                        className="text-3xl font-bold text-white mb-2"
                      >
                        Update Debt
                      </DialogTitle>
                      <p className="text-sm text-gray-400">
                        Add, edit, or remove debt items for this user
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dialog Content */}
                <div className="px-6 pt-6 pb-6 sm:p-8 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {valueEditDebts.map((value, index) => {
                      return (
                        <div
                          key={`${index}-edit-debt-item`}
                          className="relative border border-gray-700/50 rounded-2xl p-6 bg-gray-700/30 hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-200 group"
                        >
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Item {index + 1}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-200 mb-2">
                                Product Name
                              </label>
                              <input
                                maxLength={50}
                                id={`nameProduct-${index}`}
                                value={value.nameProduct}
                                onChange={({ target }) => {
                                  setValueEditDebts(
                                    valueEditDebts.map((val, i) =>
                                      i === index
                                        ? { ...val, nameProduct: target.value }
                                        : val,
                                    ),
                                  );
                                }}
                                className="w-full rounded-lg bg-gray-900/50 px-4 py-2.5 text-base text-white outline-none border border-gray-600/50 placeholder:text-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition"
                                placeholder="Enter product name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-200 mb-2">
                                Price
                              </label>
                              <input
                                id={`price-${index}`}
                                type="number"
                                value={value.priceProduct}
                                onChange={({ target }) => {
                                  setValueEditDebts(
                                    valueEditDebts.map((val, i) =>
                                      i === index
                                        ? {
                                            ...val,
                                            priceProduct:
                                              parseFloat(target.value) || 0,
                                          }
                                        : val,
                                    ),
                                  );
                                }}
                                className="w-full rounded-lg bg-gray-900/50 px-4 py-2.5 text-base text-white outline-none border border-gray-600/50 placeholder:text-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition"
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-200 mb-2">
                                Quantity
                              </label>
                              <input
                                id={`quantity-${index}`}
                                type="number"
                                value={value.quantityProduct}
                                onChange={({ target }) => {
                                  setValueEditDebts(
                                    valueEditDebts.map((val, i) =>
                                      i === index
                                        ? {
                                            ...val,
                                            quantityProduct:
                                              parseInt(target.value) || 0,
                                          }
                                        : val,
                                    ),
                                  );
                                }}
                                className="w-full rounded-lg bg-gray-900/50 px-4 py-2.5 text-base text-white outline-none border border-gray-600/50 placeholder:text-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-200 mb-2">
                                Amount Paid
                              </label>
                              <input
                                id={`paid-${index}`}
                                type="number"
                                value={value.debtsPaid}
                                onChange={({ target }) => {
                                  setValueEditDebts(
                                    valueEditDebts.map((val, i) =>
                                      i === index
                                        ? {
                                            ...val,
                                            debtsPaid:
                                              parseFloat(target.value) || 0,
                                          }
                                        : val,
                                    ),
                                  );
                                }}
                                className="w-full rounded-lg bg-gray-900/50 px-4 py-2.5 text-base text-white outline-none border border-gray-600/50 placeholder:text-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition"
                                placeholder="0.00"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-semibold text-gray-200 mb-2">
                                Note
                              </label>
                              <textarea
                                id={`note-${index}`}
                                value={value.note}
                                onChange={({ target }) => {
                                  setValueEditDebts(
                                    valueEditDebts.map((val, i) =>
                                      i === index
                                        ? { ...val, note: target.value }
                                        : val,
                                    ),
                                  );
                                }}
                                className="w-full rounded-lg bg-gray-900/50 px-4 py-2.5 text-base text-white outline-none border border-gray-600/50 placeholder:text-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition resize-none"
                                placeholder="Add a note..."
                                rows="2"
                              />
                            </div>
                          </div>

                          {valueEditDebts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setValueEditDebts(
                                  valueEditDebts.filter((_, i) => i !== index),
                                );
                              }}
                              className="mt-4 w-full cursor-pointer  rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition opacity-0 group-hover:opacity-100 duration-200"
                            >
                              Remove Item
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setValueEditDebts([
                        ...valueEditDebts,
                        {
                          nameProduct: "",
                          quantityProduct: 0,
                          priceProduct: 0,
                          debtsPaid: 0,
                          note: "",
                        },
                      ]);
                    }}
                    className="mt-6 w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600/30 to-green-500/20 px-4 py-3 text-sm font-semibold text-green-300 hover:from-green-600/40 hover:to-green-500/30 border border-green-500/40 hover:border-green-500/60 transition"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add Debt Item
                  </button>
                </div>

                {/* Dialog Footer */}
                <div className="bg-gray-900/50 border-t border-gray-700/50 px-6 py-4 sm:flex sm:flex-row-reverse sm:gap-3 sm:px-8">
                  <button
                    type="button"
                    // disabled={disabledButtonUpdate}
                    onClick={() => updateDebt()}
                    className="cursor-pointer w-full rounded-lg bg-gradient-to-r from-green-600 to-green-500 px-4 py-3 text-sm font-semibold text-white hover:from-green-500 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition sm:w-auto shadow-lg hover:shadow-green-500/25"
                  >
                    Update Debt
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    onClick={() => setOpen(false)}
                    className="cursor-pointer mt-3 w-full rounded-lg bg-gray-700/50 px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-700 border border-gray-600/50 hover:border-gray-600 transition sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
      <div>
        <Dialog open={openView} onClose={setOpenView} className="relative z-10">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
          />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 text-left shadow-2xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-3xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
              >
                {/* Dialog Header */}
                <div className="px-6 pt-8 pb-6 sm:p-8 border-b border-gray-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-500/50">
                      <PlusIcon
                        aria-hidden="true"
                        className="size-7 text-green-400"
                      />
                    </div>
                    <div className="flex-1">
                      <DialogTitle
                        as="h3"
                        className="text-3xl font-bold text-white mb-2"
                      >
                        View Debt
                      </DialogTitle>
                      <p className="text-sm text-gray-400">
                        View debt details for this user, including all
                        associated debt items and payment history.
                      </p>
                      <div>
                        {listDebtByUser.map((debt) => (
                          <div
                            key={debt.id}
                            className="mt-4 text-sm text-gray-300 border border-gray-700/50 rounded-lg p-4 bg-gray-700/30"
                          >
                            <div>Name Product: {debt.nameProductOld}</div>
                            <div>Price Product: {debt.priceProduct}</div>
                            <div>Debts Paid: {debt.debtsPaid}</div>
                            <div>Quantity Product: {debt.quantityProduct}</div>
                            <div>
                              Date Debt Create:{" "}
                              {new Date(debt.dateDebCreate).toLocaleString()}
                            </div>
                            <div>Note: {debt.note}</div>
                            <div>Remaining Debt: {debt.remainingDebt}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 pt-6 pb-6 sm:p-8 max-h-96 overflow-y-auto"></div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default Debt;
