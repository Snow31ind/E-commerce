import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    borderRadius: 15,
  },
  root: {
    padding: 0,
    backgroundColor: 'yellow',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'gray',
  },
  cardImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: 10,
    // backgroundColor: 'gray',
  },
  cardBottom: {
    marginTop: 'auto',
  },
  cardBottomContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 5,
    // backgroundColor: 'gray',
  },
  coupon: {
    fontSize: 11,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productOldPrice: {
    fontSize: 11,
    textDecoration: 'line-through',
    display: 'inline',
  },
  productPrice: {
    fontSize: 16,
    color: 'tomato',
    fontWeight: '600',
  },
  productDiscount: {
    fontSize: 13,
    display: 'inline',
    color: 'green',
    fontWeight: '600',
  },
  tagBox: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 2,
    marginRight: 5,
    marginBottom: 5,
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export { useStyles };
