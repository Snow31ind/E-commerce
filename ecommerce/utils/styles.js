import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  navbar: {
<<<<<<< HEAD
    '& a': {
      color: 'black',
=======
    // backgroundColor: ',
    "& a": {
      color: "#ffffff",
      marginLeft: 10,
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a
    },
  },
  appBar: {
    padding: '5px 100px',
    // height: 60,
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  grow: {
    flexGrow: 1,
  },
  main: {
<<<<<<< HEAD
    paddingTop: 20,
    paddingLeft: 300,
    paddingRight: 300,
    backgroundColor: '#f5f5f5',
  },
  footer: {
    backgroundColor: '#00bcd4',
    display: 'flex',
  },
  footerBox: {
    flex: 1,
=======
    minHeight: "80vh",
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
  },
  navbarButton: {
    color: "#ffffff",
    textTransform: "initial",
  },
  transparentBackgroud: {
    backgroundColor: "transparent",
  },
  error: {
    color: "#f04040",
  },
  fullWidth: {
    width: "100%",
  },
  reviewForm: {
    maxWidth: 800,
    width: "100%",
  },
  reviewItem: {
    marginRight: "1rem",
    borderRight: "1px #808080 solid",
    paddingRight: "1rem",
  },
  toolbar: {
    justifyContent: "space-between",
  },
  menuButton: { padding: 0 },
  mt1: { marginTop: "1rem" },
  // search
  // searchSection: {
  //   display: 'none',
  //   [theme.breakpoints.up('md')]: {
  //     display: 'flex',
  //   },
  // },
  searchForm: {
    border: "1px solid #ffffff",
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  searchInput: {
    paddingLeft: 5,
    color: "#000000",
    "& ::placeholder": {
      color: "#606060",
    },
  },
  iconButton: {
    backgroundColor: "#f8c040",
    padding: 5,
    borderRadius: "0 5px 5px 0",
    "& span": {
      color: "#000000",
    },
  },
  sort: {
    marginRight: 5,
  },

  fullContainer: { height: "100vh" },
  mapInputBox: {
    position: "absolute",
    display: "flex",
    left: 0,
    right: 0,
    margin: "10px auto",
    width: 300,
    height: 40,
    "& input": {
      width: 250,
    },
  },
<<<<<<< HEAD
  slug_productName: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  slug_productOldPrice: {
    fontSize: 13,
    textDecoration: 'line-through',
    color: 'gray',
=======
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productOldPrice: {
    fontSize: 11,
    textDecoration: "line-through",
    display: "inline",
  },
  productPrice: {
    fontSize: 15,
  },
  productDiscount: {
    fontSize: 13,
    display: "inline",
  },
  slug_productName: {
    fontSize: 30,
    fontWeight: "bold",
  },
  slug_productOldPrice: {
    fontSize: 13,
    textDecoration: "line-through",
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a
  },
  slug_productPrice: {
    fontSize: 24,
    color: 'tomato',
    fontWeight: 'bold',
  },
  slug_productDiscount: {
    fontSize: 17,
    color: 'green',
    fontWeight: '600',
  },
<<<<<<< HEAD

=======
  tag: {
    fontSize: 11,
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "solid",
    borderRadius: 5,
    padding: 2,
    marginRight: 5,
    marginBottom: 5,
  },
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a
  coupon: {
    fontSize: 11,
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
<<<<<<< HEAD

=======
  tagBox: {
    display: "flex",
    flexWrap: "wrap",
  },
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a
  card: {
    height: "100%",
    display: "flex",
    borderRadius: 15,
  },
  cardContent: {
<<<<<<< HEAD
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
=======
    display: "flex",
    flexDirection: "column",
    // backgroundColor: 'tomato',
    // flex: 1,
>>>>>>> 4c5a7fcdf7a871ff0346b5b689e83d7a13483f8a
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardImage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // flexDirection: 'column',
    // flex: 1,
  },
  cardBody: {
    // backgroundColor: 'darkgray',
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginTop: 10,
  },
  cardBottom: {
    marginTop: "auto",
  },
  cardBottomContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 28,
  },
  loginHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  flex: {
    display: "flex",
  },

  sectionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionText: {
    fontSize: 8,
    color: 'gray',
  },

  bold: {
    fontWeight: 'bold',
  },
  root: {
    position: 'sticky',
  },
  property: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  propertyText: {
    marginLeft: 5,
  },
  propertyLabel: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  slugCard: {
    borderRadius: 20,
  },

  emptyCart: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  cartItemPrice: {
    fontWeight: 'bold',
    color: 'tomato',
  },
  cartItemOldPrice: {
    fontWeight: 'bold',
    textDecoration: 'line-through',
  },
  cartItemDiscount: {
    fontWeight: 'bold',
    color: 'green',
  },
  cartItemName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cartItemDetail: {
    fontSize: 14,
    color: "gray",
  },
  cartItemImage: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cardAdmin: {
    justifyContent: "center",
    display: "flex",
  },

  gray: {
    backgroundColor: 'gray',
  },

  modal: {
    position: 'absolute',
    top: 150,
    left: 'calc(50% - 400px)',
    padding: 5,
    width: 800,
  },
  loginCard: {
    display: 'flex',
  },
  loginContent: {
    flex: 1,
  },
}));

export { useStyles };
