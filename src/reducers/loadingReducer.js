import { createSlice } from "@reduxjs/toolkit";


export const loadingSlice = createSlice ({
    name: "loading",
    initialState: {
        loading: false,
    },
    reducers: {
        start_loading: (state) => {
            state.loading = true;
        },
        finish_loading: (state) => {
            state.loading = false;
        }
    }
});

export const { start_loading, finish_loading } = loadingSlice.actions;

export const selectLoading = (state) => state.loading;

export default loadingSlice.reducer;