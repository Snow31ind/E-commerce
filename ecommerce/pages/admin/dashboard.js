import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuList,
  MenuItem,
  ListItemIcon,
  Divider,
  Paper,
  Typography,
  CircularProgress,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  GroupOutlined,
  HomeOutlined,
  ProductionQuantityLimitsOutlined,
  SummarizeOutlined,
} from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Layout from "../../layouts/Layout";
import { getError } from "../../utils/errors";
import { Store } from "../../utils/Store";
import { useStyles } from "../../utils/styles";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement);

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "", summary: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function AdminDashboard() {
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(Store);
  const { user } = state;
  const [{ summary, loading, error }, dispatch] = useReducer(reducer, {
    summary: { salesData: [] },
    loading: true,
    error: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/summary", {
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
    <Layout title="Admin Dashboard">
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
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h2">
                            ${summary.ordersPrice}
                          </Typography>
                          <Typography>Sales</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              View sales
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h2">
                            {summary.ordersCount}
                          </Typography>
                          <Typography>Orders</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              View orders
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h2">
                            {summary.productsCount}
                          </Typography>
                          <Typography>Products</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/products" passHref>
                            <Button size="small" color="primary">
                              View products
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h2">
                            {summary.usersCount}
                          </Typography>
                          <Typography>Users</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/users" passHref>
                            <Button size="small" color="primary">
                              View users
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography variant="h3">Sales Chart</Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((x) => x._id),
                    datasets: [
                      {
                        label: "Sales",
                        backgroundColor: "rgba(162, 222, 208, 1)",
                        data: summary.salesData.map((x) => x.totalSales),
                      },
                    ],
                  }}
                  options={{
                    legend: { display: true, position: "right" },
                  }}
                ></Bar>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

// export default AdminDashboard;
export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
