/* eslint-disable react/no-multi-comp */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import asyncCom from './asyncCom';

const NotFound = () => {
    return <div>NotFound</div>;
};

export interface RouterConfig {
    auth?: boolean; // 登录验证
    key?: string;
    title?: React.ComponentType | React.ElementType | string; // 侧边栏名字
    path?: string; // 路径
    icon?: string; // icon
    exact?: boolean;
    strict?: boolean;
    meta?: {
        title: string;
        icon: string;
    };
    // breadcrumb?: React.ComponentType | React.ElementType | string; // breadcrumb侧边栏名字
    // routes?: Array<RouterConfig>; // 子路由数组
    children?: Array<RouterConfig>; // 子路由数组
    redirect?: string; // 重定向地址
    hideInMenu?: boolean; // 在菜单中隐藏路由 可以用于详情页配置
    component?:
        | React.ComponentType<RouteComponentProps<any>>
        | React.ComponentType<any>
        | string;
}

/**
 * 根据数据重整路由 判断是第一个重定向还是404
 *
 * @param {RouterConfig} item
 * @param {boolean} [redirectOrNotFound=true] true代表重定向 如果父路由没有redirect，可以用这个办法默认指向第一个
 * @return {*}  {RouterConfig}
 */

export const createPermissionRouter = (
    item: RouterConfig,
    redirectOrNotFound = true,
): RouterConfig => {
    if (item.children && item.children.length > 0) {
        if (redirectOrNotFound) {
            return {
                ...item,
                redirect: item.children?.[0]?.path,
                children: item.children.map(route =>
                    createPermissionRouter(route, redirectOrNotFound),
                ),
            };
        }
        item.children = [
            ...item.children,
            {
                path: '*',
                hideInMenu: true,
                component: NotFound,
            },
        ];
        return item;
    }
    return {
        ...item,
        // path: path + item.path,
        exact: true,
    };
};

const routers: RouterConfig[] = [
    {
        path: '/404',
        hideInMenu: true,
        component: NotFound,
    },
    {
        path: '/login',
        hideInMenu: true,
        component: () => <div></div>,
    },
    {
        path: '/index',
        component: () => <div></div>,
        auth: true,
        children: [],
    },
    {
        path: '/',
        redirect: '/index',
    },
    {
        path: '*',
        hideInMenu: true,
        component: NotFound,
    },
];

const routeUsed = routers.map(item => createPermissionRouter(item, false));

export default routeUsed;
