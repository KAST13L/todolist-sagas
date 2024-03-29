import React, {useCallback} from 'react';
import {logoutWorkerSagaAC} from "@app/features/Auth/auth-reducer";
import LinearProgress from "@mui/material/LinearProgress";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "@app/app/store";
import {RequestStatusType} from "@app/app/app-reducer";
import Button from "@mui/material/Button";
import {AddItemForm} from "@app/components/AddItemForm/AddItemForm";
import {addTodolistWorkerSagaAC} from "@app/features/Todolist/todolists-reducer";
import {AppBar} from "@mui/material";

const selectIsLoggedIn = (state: AppRootStateType): boolean => state.auth.isLoggedIn
const selectStatus = (state: AppRootStateType): RequestStatusType => state.app.status

export const Header = () => {
    const dispatch = useDispatch()

    const status = useSelector(selectStatus)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const logoutClick = () => {
        dispatch(logoutWorkerSagaAC())
    }

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistWorkerSagaAC(title))
    }, [dispatch])

    return (
        <AppBar position={'static'} color='default'>
            <div className='flex justify-between items-center p-3 text-center smw:flex-col'>
                {!isLoggedIn && <div></div>}
                <span className='flex justify-between smd:flex-col smw:mb-2'>
                    <span className='text-5xl smd:mb-3'>TODOLIST</span>
                    <span className='px-3'>{isLoggedIn && <AddItemForm addItem={addTodolist}/>}</span>
                </span>
                <span>
                    {isLoggedIn && <Button onClick={logoutClick} color={'error'} variant={'contained'}>Log out</Button>}
                </span>
            </div>
            <span className='h-[3px]'>{status === 'loading' && <LinearProgress/>}</span>
        </AppBar>

    );
};

