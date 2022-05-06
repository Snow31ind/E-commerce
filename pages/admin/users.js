import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Box,
  Stack,
  Skeleton,
} from '@mui/material';
import { getError } from '../../utils/errors';
import { Store } from '../../utils/Store';
import Layout from '../../layouts/Layout';
import { useStyles } from '../../utils/styles';
import { useSnackbar } from 'notistack';
import Dashboard from '../../components/Dashboard';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridActionsCellItem, GridToolbar } from '@mui/x-data-grid/components';
import { Delete, Edit } from '@mui/icons-material';
import CustomNoRowsOverlay from '../../components/CustomNoRowsOverlay';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

const actionsOnProduct = [
  {
    icon: <Delete />,
    label: 'Delete product',
    onClick: () => {},
    showInMenu: true,
  },
  {
    icon: <Edit />,
    label: 'Edit product',
    onClick: () => {},
    showInMenu: false,
  },
];

const columns = [
  {
    field: 'id',
    headerName: 'User ID',
    width: 150,
    description: 'ID of the user',
    flex: 1,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    description: 'Name of the user',
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 150,
    description: "User's email",
    flex: 1,
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone Number',
    type: 'number',
    width: 150,
    description: "User's phone number",
    flex: 1,
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 150,
    description: 'Performed actions',
    getActions: (params) =>
      actionsOnProduct.map((action, index) => (
        <GridActionsCellItem key={index} {...action} />
      )),
  },
];

function AdminUsers() {
  const {
    userState: { user },
  } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();

  const [pageSize, setPageSize] = useState(10);

  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: '',
    });

  const pageSizeChangeHandler = (newPageSize) => {
    setPageSize(newPageSize);
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users`, {
          headers: { authorization: `Bearer ${user.token}` },
        });

        const formattedData = data.map((user) => ({
          id: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
        }));

        dispatch({ type: 'FETCH_SUCCESS', payload: formattedData });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteHandler = async (userId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${user.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Users">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Dashboard selectedSection={'users'} />
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>{loadingDelete && <CircularProgress />}</ListItem>

              <ListItem>
                {loading ? (
                  <Stack spacing={1} flex={1}>
                    <Skeleton variant="text" animation="wave" />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      height={250}
                    />
                  </Stack>
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flex: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <DataGrid
                        autoHeight
                        checkboxSelection
                        columns={columns}
                        rows={users}
                        pageSize={pageSize}
                        onPageSizeChange={pageSizeChangeHandler}
                        rowsPerPageOptions={[5, 10, 20]}
                        initialState={{}}
                        components={{
                          Toolbar: GridToolbar,
                          NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                        sx={{
                          border: 2,
                          borderColor: 'primary.light',
                          '& .MuiDataGrid-cell:hover': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });
