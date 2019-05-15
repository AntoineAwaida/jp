import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import Map from "../Map/Map";
import Sync from "../Sync/Sync";
import Orders from "../Orders/Orders";
import ViewOrder from "../Orders/viewOrder/ViewOrder";

const OrderNavigator = createStackNavigator(
  {
    Orders: {
      screen: Orders,
      navigationOptions: {
        title: "Create Order"
      }
    },

    ViewOrder: {
      screen: ViewOrder
    }
  },
  {
    initialRouteParams: "Orders"
  }
);

const TabNavigator = createMaterialBottomTabNavigator({
  Orders: {
    screen: OrderNavigator
  },

  Map: {
    screen: Map
  },

  Sync: {
    screen: Sync
  }
});

export default createAppContainer(TabNavigator);
