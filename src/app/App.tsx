import React, {FC, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {initializeAppWSAC} from "./app-reducer";
import {AppRootStateType} from "./store";
import {Login} from "@app/features/Auth/login.component";
import {TodolistsList} from "@app/features/TodolistsList/todolistsList.component";
import {Header} from "@app/features/Header/header.component";

const selectIsInitialized = (state: AppRootStateType): boolean => state.app.isInitialized

type AppPropsType = {
    demo?: boolean
}

export const App: FC<AppPropsType> = ({demo = false}) => {

    const isInitialized = useSelector(selectIsInitialized)
    const dispatch = useDispatch()

    if (demo) {}

    useEffect(() => {
        dispatch(initializeAppWSAC())
    }, [])

    if (!isInitialized) {
        return <CircularProgress className="fixed w-[100%] text-center top-[30%]"/>
    }

    return (
        <span>
            <ErrorSnackbar/>
            <Header/>
            <div className="mx-4 mt-6">
                <Routes>
                    <Route path='/' element={<TodolistsList/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path='*' element={<Navigate to={'/404'}/>}/>
                </Routes>
            </div>
        </span>
    )
}