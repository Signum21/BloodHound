import React from 'react';

const Abuse = () => {
    return (
        <>
            <p>
                As a Global Admin, you can change passwords, run commands on
                VMs, read key vault secrets, activate roles for other users,
                etc.
            </p>
            <p>Via PowerZure</p>
            <a href='https://powerzure.readthedocs.io/en/latest/Functions/operational.html'>
                https://powerzure.readthedocs.io/en/latest/Functions/operational.html
            </a>
            <p>
                For Global Admin to be able to abuse Azure resources, you must
                first grant yourself the 'User Access Administrator' role in
                Azure RBAC. This is done through a toggle button in the portal,
                or via the PowerZure function Set-AzureElevatedPrivileges.
            </p>
            <p>
                Once that role is applied to account, you can then add yourself
                as an Owner to all subscriptions in the tenant
            </p>
        </>
    );
};
export default Abuse;
