import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Box,
  Chip,
  Stack,
  Skeleton,
} from '@mui/material';
import { getError } from '../../utils/errors';
import { Store } from '../../utils/Store';
import Layout from '../../layouts/Layout';
import { useStyles } from '../../utils/styles';
import Dashboard from '../../components/Dashboard';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { formatPriceToVND } from '../../utils/helpers';
import { Autorenew, Done, Edit, Delete } from '@mui/icons-material';
import CustomNoRowsOverlay from '../../components/CustomNoRowsOverlay';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

const actionsOnOrder = [
  {
    label: 'Edit',
    onClick: () => {},
    icon: <Edit />,
    showInMenu: false,
  },
  {
    label: 'Remove',
    onClick: () => {},
    icon: <Delete />,
    showInMenu: true,
  },
];

const columns = [
  {
    field: 'id',
    headerName: 'No.',
    description: "Order's ID",
    width: 200,
  },
  {
    field: 'userId',
    headerName: 'User',
    description: "User's ID",
    width: 220,
  },
  {
    field: 'date',
    headerName: 'Ordered',
    type: 'date',
    width: 100,
    flex: 1,
    valueGetter: ({ value }) => value && new Date(value),

    description: 'Day of purchase',

    valueParser: (value) => value,
  },
  {
    field: 'paymentMethod',
    headerName: 'Payment',
    type: 'singleSelect',
    valueOptions: ['PayPal', 'Cash'],
    width: 100,
    description: 'Payment method',
    renderCell: (params) => {
      const paymentMethod = params.value;

      return (
        <Chip
          variant="outlined"
          color={paymentMethod === 'PayPal' ? 'secondary' : 'primary'}
          label={paymentMethod}
        />
      );
    },
  },
  {
    field: 'total',
    headerName: 'Total (VND)',
    type: 'number',
    width: 100,
    description: 'Total price',

    valueFormatter: (params) => formatPriceToVND(params.value),
  },
  {
    field: 'isPaid',
    headerName: 'Paid',
    type: 'singleSelect',
    // flex: 1,
    valueOptions: ['Pending', 'Completed'],
    width: 120,
    description: 'Payment status',
    renderCell: (params) => {
      const status = params.value ? 'Completed' : 'Pending';

      return (
        <Chip
          variant="outlined"
          icon={params.value ? <Done /> : <Autorenew />}
          color={params.value ? 'success' : 'warning'}
          label={status}
        />
      );
    },
    valueParser: (value) => (value ? 'Completed' : 'Pending'),
  },
  {
    field: 'isDelivered',
    headerName: 'Delivered',
    type: 'singleSelect',
    valueOptions: ['Pending', 'Completed'],
    width: 120,
    description: 'Delivery status',
    renderCell: (params) => {
      const status = params.value ? 'Completed' : 'Pending';

      return (
        <Chip
          variant="outlined"
          icon={params.value ? <Done /> : <Autorenew />}
          color={params.value ? 'success' : 'warning'}
          label={status}
        />
      );
    },
  },
  {
    field: 'actions',
    headerName: 'Actions',
    type: 'actions',
    flex: 1,
    getActions: (params) => {
      const actions = actionsOnOrder.map((action) => (
        <GridActionsCellItem key={action.label} {...action} />
      ));

      return actions;
    },
  },
];

function AdminOrders() {
  const { state } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { user } = state;
  const [pageSize, setPageSize] = useState(10);

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`, {
          headers: { authorization: `Bearer ${user.token}` },
        });

        const formattedOrders = data.map((order) => ({
          id: order._id,
          userId: order.user._id,
          userPhoneNumber: order.user.phoneNumber,
          date: order.createdAt,
          total: order.totalPrice,
          isPaid: order.isPaid,
          isDelivered: order.isDelivered,
          paymentMethod: order.paymentMethod,
        }));

        // console.log(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: formattedOrders });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  const pageSizeChangeHandler = (newPageSize) => {
    setPageSize(newPageSize);
  };

  return (
    <Layout title="Orders">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Dashboard selectedSection={'orders'} />
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      height: '100%',
                    }}
                  >
                    <Stack spacing={1} flex={1}></Stack>
                    <Box sx={{ flex: 1 }}>
                      <DataGrid
                        // autoPageSize
                        autoHeight
                        checkboxSelection
                        density="standard"
                        columns={columns}
                        rows={orders}
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

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });
