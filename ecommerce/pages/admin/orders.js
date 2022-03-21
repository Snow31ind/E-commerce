import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useEffect, useContext, useReducer } from "react";
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuList,
  MenuItem,
  ListItemIcon,
  Divider,
  Paper,
} from "@mui/material";
import {
  GroupOutlined,
  HomeOutlined,
  ProductionQuantityLimitsOutlined,
  SummarizeOutlined,
} from "@mui/icons-material";
import { getError } from "../../utils/errors";
import { Store } from "../../utils/Store";
import Layout from "../../layouts/Layout";
import { useStyles } from "../../utils/styles";
import { useSnackbar } from "notistack";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function AdminOrders() {
  const { state } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { user } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/orders`, {
          headers: { authorization: `Bearer ${user.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);
  return (
    <Layout title="Orders">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Paper>
            <MenuList>
              <MenuItem>
                <ListItemIcon>
                  <HomeOutlined />
                </ListItemIcon>
                <NextLink href="/admin/dashboard" passHref>
                  <ListItemText>Admin Dashboard</ListItemText>
                </NextLink>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <SummarizeOutlined fontSize="small" />
                </ListItemIcon>
                <NextLink href="/admin/orders" passHref>
                  <ListItemText>Orders</ListItemText>
                </NextLink>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <ProductionQuantityLimitsOutlined fontSize="small" />
                </ListItemIcon>
                <NextLink href="/admin/products" passHref>
                  <ListItemText>Products</ListItemText>
                </NextLink>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <GroupOutlined fontSize="small" />
                </ListItemIcon>
                <NextLink href="/admin/users" passHref>
                  <ListItemText>Users</ListItemText>
                </NextLink>
              </MenuItem>
            </MenuList>
          </Paper>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h3">
                  Orders
                </Typography>
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>USER</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>
                              {order.user ? order.user.name : "DELETED USER"}
                            </TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>${order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${order.paidAt}`
                                : "not paid"}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `delivered at ${order.deliveredAt}`
                                : "not delivered"}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
