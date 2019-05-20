import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import Map from "../Map/Map";
import Sync from "../Sync/Sync";
import Orders from "../Orders/Orders";
import ViewOrder from "../Orders/viewOrder/ViewOrder";
import ListOrders from "../Orders/listOrders/ListOrders";
import Login from "../Login/Login";
import ArticlesList from "../Orders/layouts/articles/ArticlesList";
import Settings from "../Settings/Settings";

const OrderNavigator = createStackNavigator(
  {
    Orders: {
      screen: Orders
    },

    ArticlesList: {
      screen: ArticlesList
    },

    ViewOrder: {
      screen: ViewOrder
    },
    ListOrders: {
      screen: ListOrders
    }
  },

  {
    initialRouteParams: "Orders"
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Orders: {
      screen: OrderNavigator
    },

    Map: {
      screen: Map
    },

    Sync: {
      screen: Sync
    }
  },
  {
    tabBarOptions: {
      activeBackgroundColor: "purple",
      activeTintColor: "white",
      inactiveTintColor: "gray",
      inactiveBackgroundColor: "white"
    }
  }
);

const TabAdminNavigator = createBottomTabNavigator(
  {
    Orders: {
      screen: OrderNavigator
    },

    Map: {
      screen: Map
    },

    Sync: {
      screen: Sync
    },

    Settings: {
      screen: Settings
    }
  },
  {
    tabBarOptions: {
      activeBackgroundColor: "purple",
      activeTintColor: "white",
      inactiveTintColor: "gray",
      inactiveBackgroundColor: "white"
    }
  }
);

const AuthNavigator = createSwitchNavigator(
  {
    Login: {
      screen: Login
    },
    Main: {
      screen: TabNavigator
    },
    MainAdmin: {
      screen: TabAdminNavigator
    }
  },
  {
    initialRouteName: "Login",
    headerMode: "none",
    animationEnabled: "true"
  }
);

export default createAppContainer(AuthNavigator);
