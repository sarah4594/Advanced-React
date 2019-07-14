// user{
//   name: 'Sarah',
//   permssions: ['ADMIN', 'ITEMUPDATE']
// }

// check if they have any of these
// ['PERMISSIONUPDATE', 'ADMIN']

// if there is overlap, they have the permissions, if not, error

function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave),
  )
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions

      : ${permissionsNeeded}

      You Have:

      ${user.permissions}
      `)
  }
}

exports.hasPermission = hasPermission
