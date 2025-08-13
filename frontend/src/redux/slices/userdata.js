import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios, { APIS } from "../../utils/Axios";

// Async thunk to get all countries
// export const getAllCountries = createAsyncThunk(
//   "country/getAllCountries",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await Axios({
//         method: "GET",
//         path: APIS.allCountries,
//       });
//       return response.data.data;
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.errors?.message || error.message;
//       return rejectWithValue(errorMessage);
//     }
//   }
// );
export const gettestdata = createAsyncThunk(
  "student/gettestdata",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios({
        method: "GET",
        path: "https://www.freepublicapis.com/api/apis/275",
      });

      console.log("Full response:", response.data);

      // Adjust based on actual shape
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const studentData = createSlice({
  name: "student",
  initialState: {
    data: [],
    testDaata: "",
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // get test data
      .addCase(gettestdata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(gettestdata.fulfilled, (state, action) => {
        state.loading = false;
        state.testDaata = action.payload;
        console.log("payload" + action.payload);
      })
      .addCase(gettestdata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentData.reducer;
