'use strict';

// Menu service used for managing menus
angular.module('core').service('Menus', [
		function () {
				// Define a set of default roles
				this.defaultRoles = ['*'];

				// Define the menus object
				this.menu = {};

				// A private function for rendering decision
				var shouldRender = function (user) {
						if (user) {
								if (!!~this.roles.indexOf('*')) {
										return true;
								} else {
										for (var userRoleIndex in user.roles) {
												for (var roleIndex in this.roles) {
														if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
																return true;
														}
												}
										}
								}
						} else {
								return this.isPublic;
						}
					return false;
				};

				// Validate menu existence
				this.validateMenuExistence = function (menuId) {
						if (menuId && menuId.length) {
								if (this.menus[menuId]) {
										return true;
								} else {
										throw new Error('Menu does not exist.');
								}
						} else {
								throw new Error('MenuId was not provided.');
						}
				};

				// Get the menu object by menu id
				this.getMenu = function (menuId) {
						// Validate that the menu exists
						this.validateMenuExistence(menuId);

						// Return the menu object
						return this.menus[menuId];
				};

				// Add new menu object by menu id
				this.addMenu = function (menuId, isPublic, roles) {
						// Create the new menu
						this.menus[menuId] = {
								isPublic: isPublic || false,
								roles: roles || this.defaultRoles,
								items: [],
								shouldRender: shouldRender
						};

						// Return the menu object
						return this.menus[menuId];
				};

				// Remove existing menu object by menu id
				this.removeMenu = function (menuId) {
						// Validate that the menu exists
						this.validateMenuExistence(menuId);

						// Return the menu object
						delete this.menus[menuId];
				};

				// Add menu item object
				this.addMenuItem = function (menuId, menuItemTitle, menuItemUrl, menuItemType, menuItemUIRoute, isPublic, roles, position) {
						this.menus[menuId].items.push({
								title: menuItemTitle,
								link: menuItemUrl,
								menuItemType: menuItemType || 'item',
								menuItemClass: menuItemType,
								uiRoute: menuItemUIRoute || ('/' + menuItemUrl),
								isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
								roles: ((roles === null ||typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
								position: position || 0,
								items: [],
								shouldRender: shouldRender
						});

						// Return the menu object
						return this.menus[menuId];
				};

				// Add sub-menu item object
				this.addSubMenuItem = function (menuId, rootMenuItemUrl, menuItemTitle, menuItemUrl, menuItemUIRoute, isPublic, roles, position) {
						// Validate that the menu exists
						this.validateMenuExistence(menuId);

						// Search for menu item by menuId
						for (var itemIndex in this.menus[menuId].items) {
								if (this.menus[menuId].items[itemIndex].link === rootMenuItemUrl) {
										// Push new sub-menu item into that menu item
										this.menus[menuId].items[itemIndex].items.push({
												title: menuItemTitle,
												link: menuItemUrl,
												uiRoute: menuItemUIRoute || ('/' + menuItemUrl),
												isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
												roles: ((roles === null ||typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
												position: position || 0,
												shouldRender: shouldRender
										});
								}
						}

						// Return the menu object
						return this.menus[menuId];
				};

				// Remove existing menu object by menu id
				this.removeMenuItem = function (menuId, menuItemUrl) {
						// Validate that the menu exists
						this.validateMenuExistence(menuId);

						// Search for menu item to be removed
						for (var itemIndex in this.menus[menuId].items) {
								if (this.menus[menuId].items[itemIndex].link === menuItemUrl) {
										this.menus[menuId].items.splice(itemIndex, 1);
								}
						}

						// Return the removed menu object
						return this.menus[menuId];
				};

				// Remove existing sub menu object by menu id
				this.removeSubMenuItem = function (menuid, subMenuItemUrl) {
						// Validate that the menu exists
						this.validateMenuExistence(menuId);

						// Search for sub-menu item to be removed
						for (var itemIndex in this.menus[menuId].items) {
								for (var subItemIndex in this.menus[menuId].items[itemIndex].items) {
										if (this.menus[menuId].items[itemIndex].items[subItemIndex].link === subMenuItemUrl) {
												this.menus[menuId].items[itemIndex].items.splice(subItemIndex, 1);
										}
								}
						}

						// Return the removed sub-menu object
						return this.menus[menuId];
				};

				// Adding the topbar menu
				this.addMenu('topbar');
		}
]);