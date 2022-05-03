import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  cartItemImage: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cartItemName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cartItemDetail: {
    fontSize: 14,
    color: 'gray',
  },
  flex: {
    display: 'flex',
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
  grow: {
    flexGrow: 1,
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export { useStyles };
