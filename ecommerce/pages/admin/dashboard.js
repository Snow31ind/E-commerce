import {
  Card,
  Grid,
  List,
  ListItem,
  Typography,
  CircularProgress,
  CardContent,
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
          <Dashboard selectedSection="dashboard" />
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
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography variant="h3">Sales Chart</Typography>
              </ListItem>
              <ListItem>
                <Chart
                  ref={chartRef}
                  // onClick={clickGraphHandler}
                  data={chartData}
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
