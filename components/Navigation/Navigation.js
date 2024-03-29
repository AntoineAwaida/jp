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
import Logs from "../Settings/Logs";

import React from "react";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Logout from "../Logout/Logout";
import UserSettings from "../Settings/UserSettings";

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

const SettingsNavigator = createStackNavigator({
  Settings: {
    screen: Settings
  },
  Logs: {
    screen: Logs
  }
});

const TabNavigator = createBottomTabNavigator(
  {
    Orders: {
      screen: OrderNavigator
    },

    // Map: {
    //   screen: Map
    // },

    Sync: {
      screen: Sync
    },

    Settings: {
      screen: UserSettings
    },

    Logout: {
      screen: Logout
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        let IconComponent = FontAwesome5;
        const { routeName } = navigation.state;
        if (routeName === "Orders") {
          iconName = "list-alt";
        } else if (routeName === "Map") {
          iconName = "map-signs";
        } else if (routeName === "Settings") {
          iconName = "cog";
        } else if (routeName === "Sync") {
          iconName = "sync-alt";
        } else {
          iconName = "sign-out-alt";
        }

        return <IconComponent name={iconName} size={25} color={tintColor} />;
      }
    }),

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

    // Map: {
    //   screen: Map
    // },

    Sync: {
      screen: Sync
    },

    Settings: {
      screen: SettingsNavigator
    },

    Logout: {
      screen: Logout
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        let IconComponent = FontAwesome5;
        const { routeName } = navigation.state;
        if (routeName === "Orders") {
          iconName = "list-alt";
        } else if (routeName === "Map") {
          iconName = "map-signs";
        } else if (routeName === "Sync") {
          iconName = "sync-alt";
        } else if (routeName === "Settings") {
          iconName = "cog";
        } else {
          iconName = "sign-out-alt";
        }

        return <IconComponent name={iconName} size={25} color={tintColor} />;
      }
    }),

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
