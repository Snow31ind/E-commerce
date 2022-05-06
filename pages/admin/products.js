import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer } from 'react';
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Box,
  Chip,
  Stack,
  Skeleton,
  Modal,
  Backdrop,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { getError } from '../../utils/errors';
import { Store } from '../../utils/Store';
import Layout from '../../layouts/Layout';
import { useStyles } from '../../utils/styles';
import { useSnackbar } from 'notistack';
import Dashboard from '../../components/Dashboard';
import { capitalize, formatPriceToVND } from '../../utils/helpers';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridActionsCellItem, GridToolbar } from '@mui/x-data-grid/components';
import { useState } from 'react';
import CustomNoRowsOverlay from '../../components/CustomNoRowsOverlay';
import ProductModal from '../../modals/ProductModal';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
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

function AdminProducts() {
  const {
    userState: { user },
  } = useContext(Store);

  const router = useRouter();
  const classes = useStyles();

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });
  const [pageSize, setPageSize] = useState(10);
  const [refresh, setRefresh] = useState(0);
  const pageSizeChangeHandler = (newPageSize) => {
    setPageSize(newPageSize);
  };
  const [openModal, setOpenModal] = useState({
    state: false,
    productId: null,
  });

  const openModalHandler = (id) => {
    console.log('openModalHandler');
    setOpenModal({ ...openModal, state: true });
  };

  const closeModalHandler = () => {
    setOpenModal({ ...openModal, state: false });
  };

  const clickEditProductHandler = (id) => {
    setOpenModal({ state: true, productId: id });
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${user.token}` },
        });

        const formattedData = data.map((product) => ({
          id: product._id,
          category: product.category,
          name: product.name,
          brand: product.brand,
          oldPrice: product.oldPrice,
          price: product.price,
          countInStock: product.countInStock,
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
  }, [refresh]);

  const actionsOnProduct = [
    {
      icon: <Delete />,
      label: 'Delete product',
      onClick: (id) => {
        console.log(id);
      },
      showInMenu: true,
    },
    {
      icon: <Edit />,
      label: 'Edit product',
      onClick: clickEditProductHandler,
      showInMenu: false,
    },
  ];

  const columns = [
    {
      field: 'id',
      headerName: 'Product ID',
      width: 100,
      description: "Product's ID",
      valueFormatter: (params) => {
        const N = params.id.toString().length;
        return `${params.id.toString().substring(N - 8, N)}`;
      },
    },
    {
      field: 'category',
      headerName: 'Category',
      decription: "Product's category",
      valueFormatter: (params) => {
        const formatted = capitalize(params.value);

        return formatted;
      },
      renderCell: (params) => {
        return <Chip color="primary" label={capitalize(params.value)} />;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      description: "Product's name",
      flex: 1,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      description: "Product's brand",
    },
    {
      field: 'oldPrice',
      type: 'number',
      headerName: 'Old Price (VND)',
      width: 150,
      description: "Product's old price",
      valueFormatter: (params) => {
        // const valueFormatted = Number(params.value).toLocaleString();
        return `${formatPriceToVND(params.value)}`;
      },
    },
    {
      field: 'price',
      type: 'number',
      headerName: 'Price (VND)',
      width: 150,
      description: "Product's price",
      valueFormatter: (params) => {
        // const valueFormatted = Number(params.value).toLocaleString();
        return `${formatPriceToVND(params.value)}`;
      },
    },
    {
      field: 'countInStock',
      type: 'number',
      headerName: 'Stock Quantity',
      width: 150,
      description: 'Availability of the product',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      description: 'Performed actions',
      getActions: (params) =>
        actionsOnProduct.map((action, index) => (
          <GridActionsCellItem
            key={index}
            {...action}
            onClick={() => action.onClick(params.id)}
          />
        )),
    },
  ];

  return (
    <Layout title="Products Dashboard">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Dashboard selectedSection={'products'} />
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                </Grid>
              </ListItem>

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
                        density="compact"
                        columns={columns}
                        rows={products}
                        pageSize={pageSize}
                        onPageSizeChange={pageSizeChangeHandler}
                        rowsPerPageOptions={[5, 10, 20]}
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

      <Modal
        closeAfterTransition
        open={openModal.state}
        onClose={closeModalHandler}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <ProductModal
          setRefresh={setRefresh}
          closeModalHandler={closeModalHandler}
          productId={openModal.productId}
        />
      </Modal>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
