import {  createSlice } from "@reduxjs/toolkit";

import { useEffect } from "react";

const initialState = {
    events: [],
    singleEvent:null,
    filterEvent:[]
  };
  const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
      setEvent: (state, action) => {
        state.events = action.payload;
      },
      setSingleEvent:(state ,action)=>{
        state.singleEvent=action.payload
      },
      setFilterEvent:(state ,action)=>{
        state.filterEvent=action.payload
      },

    },
  });

  export const { setEvent,setSingleEvent ,setFilterEvent} = eventSlice.actions;
  export default eventSlice.reducer;
