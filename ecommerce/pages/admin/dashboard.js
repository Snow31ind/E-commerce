import {
  Card,
  Grid,
  List,
  ListItem,
  Typography,
  CircularProgress,
  CardContent,
<<<<<<< HEAD
  Stack,
  Skeleton,
} from '@mui/material';
import { Category, CreditCard, Group, Receipt } from '@mui/icons-material';
import axios from 'axios';
import React, { useContext, useReducer, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../../layouts/Layout';
import { getError } from '../../utils/errors';
import { Store } from '../../utils/Store';
import { useStyles } from '../../utils/styles';
import Dashboard from '../../components/Dashboard';
=======
  CardActions,
  ListItemButton,
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
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
<<<<<<< HEAD
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import {
  Chart,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from 'react-chartjs-2';
import { formatPriceToVND } from '../../utils/helpers';
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);
=======
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement);
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a

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
  const chartRef = useRef();

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

  if (loading) {
    return <Layout title="Admin Dashboard"></Layout>;
  }
  const sections = [
    {
      label: 'Sales',
      value: formatPriceToVND(summary.ordersPrice),
      icon: <CreditCard />,
    },
    {
      label: 'Orders',
      value: summary.ordersCount,
      icon: <Receipt />,
    },
    {
      label: 'Products',
      value: summary.productsCount,
      icon: <Category />,
    },
    {
      label: 'Users',
      value: summary.usersCount,
      icon: <Group />,
    },
  ];

  const chartData = {
    labels: summary.salesData.map((x) => x._id),
    datasets: [
      {
        type: 'line',
        label: 'Sales (line)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        data: summary.salesData.map((x) => x.totalSales),
        fill: false,
      },
      {
        type: 'bar',
        label: 'Sales (bar)',
        backgroundColor: 'rgba(162, 222, 208, 1)',
        borderWidth: 2,
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };

  const clickGraphHandler = (e) => {
    // console.log(getDatasetAtEvent(chartRef.current, e));
    // console.log(getElementAtEvent(chartRef.current, e));
    console.log(getElementsAtEvent(chartRef.current, e));
  };

  return (
    <Layout title="Admin Dashboard">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
<<<<<<< HEAD
          <Dashboard selectedSection="dashboard" />
=======
          <Paper className={classes.section}>
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
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a
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
                  <Grid container spacing={5}>
<<<<<<< HEAD
                    {sections.map((section) => (
                      <Grid item md={3} key={section.label}>
                        <Card raised>
                          <CardContent>
                            {section.icon}
                            <Typography className={classes.sectionNumber}>
                              {section.value}
                            </Typography>
                            <Typography className={classes.sectionText}>
                              {section.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
=======
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h2">
                            ${summary.ordersPrice}
                          </Typography>
                          <Typography className={classes.cardAdmin}>
                            Sales
                          </Typography>
                        </CardContent>
                        <CardActions className={classes.cardAdmin}>
                          <NextLink href="/admin/orders" passHref>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                            >
                              View sales
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3} justify="center">
                      <Card raised>
                        <CardContent>
                          <Typography
                            variant="h2"
                            className={classes.cardAdmin}
                          >
                            {summary.ordersCount}
                          </Typography>
                          <Typography className={classes.cardAdmin}>
                            Orders
                          </Typography>
                        </CardContent>
                        <CardActions className={classes.cardAdmin}>
                          <NextLink href="/admin/orders" passHref>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                            >
                              View orders
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography
                            variant="h2"
                            className={classes.cardAdmin}
                          >
                            {summary.productsCount}
                          </Typography>
                          <Typography className={classes.cardAdmin}>
                            Products
                          </Typography>
                        </CardContent>
                        <CardActions className={classes.cardAdmin}>
                          <NextLink href="/admin/products" passHref>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                            >
                              View products
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography
                            className={classes.cardAdmin}
                            variant="h2"
                          >
                            {summary.usersCount}
                          </Typography>
                          <Typography className={classes.cardAdmin}>
                            Users
                          </Typography>
                        </CardContent>
                        <CardActions className={classes.cardAdmin}>
                          <NextLink href="/admin/users" passHref>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                            >
                              View users
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography variant="h3">Sales Chart</Typography>
              </ListItem>
              <ListItem>
<<<<<<< HEAD
                <Chart
                  ref={chartRef}
                  // onClick={clickGraphHandler}
                  data={chartData}
=======
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
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a
                  options={{
                    legend: { display: true, position: "right" },
                  }}
                ></Chart>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
