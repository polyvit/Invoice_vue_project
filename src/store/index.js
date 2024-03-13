import { createStore } from "vuex";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default createStore({
  state: {
    invoices: [],
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    currentInvoiceArray: null,
    editInvoice: null,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    SET_INVOICE_DATA(state, payload) {
      state.invoices.push(payload);
    },
    INVOICES_LOADED(state) {
      state.invoicesLoaded = true;
    },
    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoiceArray = state.invoices.filter(
        (inv) => inv.invoiceId === payload
      );
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
    },
    DELETE_INVOICE(state, payload) {
      state.invoices = state.invoices.filter((inv) => inv.docId !== payload);
    },
    UPDATE_STATUS_TO_PAID(state, payload) {
      state.invoices.forEach((inv) => {
        if (inv.docId === payload) {
          inv.invoiceDate = false;
          inv.invoicePaid = true;
          inv.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.invoices.forEach((inv) => {
        if (inv.docId === payload) {
          inv.invoicePaid = false;
          inv.invoiceDraft = false;
          inv.invoicePending = true;
        }
      });
    },
  },
  actions: {
    async GET_INVOICES({ commit, state }) {
      const results = await getDocs(collection(db, "invoices"));
      results.forEach((doc) => {
        if (!state.invoices.some((inv) => inv.docId === doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
          };
          commit("SET_INVOICE_DATA", data);
        }
      });
      commit("INVOICES_LOADED");
    },
    async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
      commit("DELETE_INVOICE", docId);
      await dispatch("GET_INVOICES");
      commit("TOGGLE_INVOICE");
      commit("TOGGLE_EDIT_INVOICE");
      commit("SET_CURRENT_INVOICE", routeId);
    },
    async DELETE_INVOICE_FROM_DB({ commit }, docId) {
      await deleteDoc(doc(db, "invoices", docId));
      commit("DELETE_INVOICE", docId);
    },
    async UPDATE_STATUS_TO_PAID_IN_DB({ commit }, docId) {
      await updateDoc(doc(db, "invoices", docId), {
        invoiceDraft: false,
        invoicePaid: true,
        invoicePending: false,
      });
      commit("UPDATE_STATUS_TO_PAID", docId);
    },
    async UPDATE_STATUS_TO_PENDING_IN_DB({ commit }, docId) {
      await updateDoc(doc(db, "invoices", docId), {
        invoiceDraft: false,
        invoicePaid: false,
        invoicePending: true,
      });
      commit("UPDATE_STATUS_TO_PENDING", docId);
    },
  },
  modules: {},
});
