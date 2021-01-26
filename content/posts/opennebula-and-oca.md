---
title: OpenNebula and Java OpenNebula Cloud API (OCA)
date: 2020-03-21T21:00:00+08:00
published: true
slug: opennebula-and-oca
tags:
- cloud computing
- OpenNebula
cover_image: "./images/opennebula-and-oca.png"
canonical_url: false
description: Using OpenNebula and Java OpenNebula API (OCA) to find a suitable strategy for VM migration.
---

:::note ℹ️ Introduction

This exercise aims to give you some practical experience of using a Cloud Virtual Infrastructure Manager (OpenNebula) and Java OpenNebula Cloud API (OCA). It will also give you the opportunity to research on the cloud computing domain of trade-offs between performance and energy efficiency.
:::

### Part1: Java OpenNebula Cloud API (OCA)

You are provided with the bulk of the code that demonstrates a basic Open- Nebula Cloud API functionality for a VM. The client program will provide some basic information such as a VM template and get various bits of tasks performed, e.g. instantiate a VM. The source code supplied to you is not complete and therefore needs completion. The work required is broken down into a series of small steps that you should follow, in the order shown, to complete the exercise.

Examine the file VMachineSample.java and try to get an overall feel for what the software is doing (or supposed to do). You should focus on the OpenNebula/client interaction aspects. By looking at the file, you should be able to see that the implementation is incomplete.

Complete the implementation of this file. You should focus on the following aspects:

* VM template: specify a template of your choice. Note: Feel free to use the template provided in the code.

* the information OpenNebula provides about the VM, e.g. name of host where it is running;

* the time is takes to instantiate the VM;

* the time it takes to delete the VM.

Compile the program. Run it and record its output.

**Note**: You are expected to run the experiments n times (e.g. n = 5) because of the inherent dynamic nature of the cloud infrastructure. A statistical analysis (average, standard deviation) is therefore expected. Compare the results of the various executions and discuss any discrepancies in performance.

#### Solution

按照题目要求，这里主要是搭配 OpenNebula，使用模板 template 创建虚拟机，删除虚拟机等操作。其中注意要记录实例化虚拟机的时间和删除虚拟机的时间。

```java
public static void main(String[] args) {
    // Let's try some of the OpenNebula Cloud API functionality for VMs.

    // First of all, a Client object has to be created.
    Client oneClient;
    String passwd;

    String username = System.getProperty("user.name");
    System.out.println(username);
    passwd = new String(System.console().readPassword("[%s]", "Password:"));

    // First of all, a Client object has to be created.
    // Here the client will try to connect to OpenNebula using the default

    try
    {
        oneClient = new Client(username + ":" + passwd, "https://csgate1.leeds.ac.uk:2633/RPC2");

        // We will try to create a new virtual machine. The first thing we
        // need is an OpenNebula virtual machine template.
        VM VMsample = new VM();


        //Client oneClient = VMsample.logIntoCloud();

        // This VM template is a valid one, but it will probably fail to run
        // if we try to deploy it; the path for the image is unlikely to
        // exist.

        String vmTemplate =
            "CPU=\"1\"\n"
            + "SCHED_DS_REQUIREMENTS=\"ID = 104\"\n" //DS DataStore
            + "NIC=[\n"
            + "\tNETWORK_UNAME=\"oneadmin\",\n"
            + "\tNETWORK=\"vnet1\" ]\n"
            + "LOGO=\"images/logos/debian.png\"\n"
            + "DESCRIPTION=\"A ttylinux instance with VNC and network context scripts, available for testing purposes. In raw format.\"\n"
            + "DISK=[\n"
            + "\tIMAGE_UNAME=\"oneadmin\",\n"
            + "\tIMAGE=\"ttylinux Base\" ]\n"
            + "SUNSTONE_NETWORK_SELECT=\"YES\"\n"
            + "SUNSTONE_CAPACITY_SELECT=\"YES\"\n"
            + "MEMORY=\"128\"\n"
            + "HYPERVISOR=\"kvm\"\n"
            + "GRAPHICS=[\n"
            + "\tLISTEN=\"0.0.0.0\",\n"
            + "\tTYPE=\"vnc\" ]\n";

        System.out.println("Virtual Machine Template:\n" + vmTemplate);
        System.out.println();

        System.out.print("Trying to allocate the virtual machine... ");
        //Starting counting VM instantiation
        long startTime = System.currentTimeMillis();

        OneResponse rc = VirtualMachine.allocate(oneClient, vmTemplate);

        if( rc.isError() )
        {
            System.out.println( "failed!");
            throw new Exception( rc.getErrorMessage() );
        }

        // The response message is the new VM's ID
        int newVMID = Integer.parseInt(rc.getMessage());
        System.out.println("ok, ID " + newVMID + ".");

        // We can create a representation for the new VM, using the returned
        // VM-ID
        VirtualMachine vm = new VirtualMachine(newVMID, oneClient);
        //Wait till it running
        while(true){
            rc = vm.info();
            String info = vm.status();
            if(info == "runn"){
                break;
            }
        }
        //VM instantiation time
        long endTime = System.currentTimeMillis();
        long timeEscape1 = endTime - startTime;
        System.out.println("Time for instantiation" + timeEscape1 + "ms");

        // Delete VM
        try {

            String del;

            VirtualMachinePool vmPool = new VirtualMachinePool(oneClient);
            rc = vmPool.info();
            System.out.println("--------------------------------------------");
            System.out.println("Number of VMs: " + vmPool.getLength());
            System.out.println("User ID\t\tName\t\tEnabled");
            // You can use the for-each loops with the OpenNebula pools
            for (VirtualMachine vm1 : vmPool) {
                String id = vm1.getId();
                String name = vm1.getName();
                String enab = vm1.xpath("enabled");
                System.out.println(id + "\t\t" + name + "\t\t" + enab);


                ///give the delay of 5Secs between each delete
                SECONDS.sleep(5);
                System.out.println("Delete this VM or not? (yes/no)");
                del = scanner.nextLine();

                if (del.equals("yes")) {

                    //  rc = vm.cancel();
                    System.out.println("\nTrying to cancel the VM " + vm.getId());

                    long startTimeDel = System.currentTimeMillis();

                    //Command to Delete the VM
                    rc = vm1.finalizeVM();

                    ///Checking the status of the VM untill we recieve done
                    while (vm1.status() != "done") {
                        rc = vm1.info();
                    }

                    long endTimeDel = System.currentTimeMillis();
                    long delete = endTimeDel - startTimeDel;
                    System.out.println("Time Elapsed to delete... " + delete);
                    // This is all the information you can get from the OneResponse:
                    System.out.println("\tOpenNebula response");
                    System.out.println("\t Error: " + rc.isError());
                    System.out.println("\t Msg: " + rc.getMessage());
                    System.out.println("\t ErrMsg: " + rc.getErrorMessage());

                }

            }

        } catch (Exception e) {

            System.out.println(e.getMessage());
        }

    }
    catch (Exception e)
    {
        System.out.println(e.getMessage());
    }


}

```

首先使用学校用户名和密码登录学校的 OpenNebula。然后使用自己定义的一个`vmTemplate`（具体配置信息可以借鉴已给出的样例代码）。然后使用`OneResponse rc = VirtualMachine.allocate(oneClient, vmTemplate)`去使用该模板创建虚拟机。

对于删除虚拟机，则需要使用`VirtualMachinePool vmPool = new VirtualMachinePool(oneClient)`去从虚拟机池中获取所有的虚拟机，然后遍历询问是否要删除。删除的方法主要是`vm.finalizeVM()`（在最新版本的OpenNebula中，该方法已废弃，已经改成`terminate()`方法）。

至于获得实例化和删除所需的时间，无非就是在之前获得系统时间 t1，之后获得系统时间 t2，两者相减即为花费的时间。

### Part2: VM Migration

You are told VM migration in clouds brings multiple benefits such as higher performance, improved manageability and fault tolerance. There are a number of VM migration mechanisms you may consider, e.g. heuristics, power-aware, performance-aware and network-aware.

Your next task is to write a program that migrates an existing VM to a target host. Propose a design and discuss your assumptions and requirements to implement your solution. Record the time it takes to migrate the VM and discuss the results.

#### Solution

```java
// Migrate VM
System.out.println("Do you want to migrate VM: (yes/no)");
String choice;
Scanner scanner = new Scanner(System.in);
choice = scanner.nextLine();
if (choice.equals("yes")) {
    VMsample.retrieveInformation(oneClient);
    System.out.println();
    System.out.println("Start to migrate vm...");
    long startTimeMigrate = System.currentTimeMillis();
    vm.liveMigrate(hostId);
    if(rc.isError())
    {
        System.out.println("failed!");
        throw new Exception( rc.getErrorMessage() );
    }
    else
        System.out.println("migrate ok.");
    System.out.println("Wait till it run again");
    while(true){
        rc = vm.info();
        String info = vm.status();
        if(info == "runn"){
            break;
        }
    }
    long endTimeMigrate = System.currentTimeMillis();
    long timeEscape2 = endTimeMigrate - startTimeMigrate;
    System.out.println("Time for migration" + "\t" + timeEscape2 + "ms");
    System.out.println("ok, check host info");
    Host host = new Host(hostId, oneClient);
    // HostPool hostPool = new HostPool(oneClient);
    String hostInfo = host.info().getMessage();
    // String type = getType(host.info().getMessage());
    // System.out.println(hostInfo);
    String result = hostInfo;
    // String hostPoolInfo = hostPool.info().getMessage();
    // System.out.print(hostPoolInfo);
    // result = result.replace("</", "\n");
    System.out.print(hostInfo);

    // Let's hold the VM, so the scheduler won't try to deploy it
    System.out.print("Trying to hold the new VM... ");
    rc = vm.hold();
    rc = vm.info();

    if(rc.isError())
    {
        System.out.println("failed!");
        throw new Exception( rc.getErrorMessage() );
    }
    else
        System.out.println("ok.");

    // And now we can request its information.
    rc = vm.info();

    if(rc.isError())
        throw new Exception( rc.getErrorMessage() );

    System.out.println();

    System.out.println(
        "This is the information OpenNebula stores for the new VM:");
    System.out.println(rc.getMessage() + "\n");

    // This VirtualMachine object has some helpers, so we can access its
    // attributes easily (remember to load the data first using the info
    // method).
    System.out.println("The new VM " +
                       vm.getName() + " has status: " + vm.status());

    // And we can also use xpath expressions
    System.out.println("The path of the disk is");
    System.out.println("\t" + vm.xpath("TEMPLATE/DISK/SOURCE") );
}
```

对于迁移虚拟机到其它的主机的方法其实很简单，就是使用`vm.liveMigrate(hostId)`或者`vm.migrate(hostId, false)`方法即可。但是要制定策略将虚拟机迁移到合适的主机才行，这就需要考虑到很多因素。

对于这道题目，考虑到 OpenNebula 网站中可以查看到的信息，主要考虑以下四个因素：

* CPU 占用量
* 内存占用量
* 磁盘占用量
* 该主机中含有的虚拟机数量

它们分别可以通过以下代码获取到：

```java
cpuUsage = (Double.parseDouble(host.xpath("/HOST/HOST_SHARE/CPU_USAGE")) / Double.parseDouble(host.xpath("/HOST/HOST_SHARE/MAX_CPU"))) * 100;

memUsage = (Double.parseDouble(host.xpath("/HOST/HOST_SHARE/MEM_USAGE")) / Double.parseDouble(host.xpath("/HOST/HOST_SHARE/MAX_MEM"))) * 100;

diskUsage = (Double.parseDouble(host.xpath("/HOST/HOST_SHARE/DISK_USAGE")) / Double.parseDouble(host.xpath("/HOST/HOST_SHARE/MAX_DISK"))) * 100;

int numVM = Integer.parseInt(host.xpath("/HOST/HOST_SHARE/RUNNING_VMS"));
```

在制定策略上，因为一个主机中存在的虚拟机数量对于性能的影响相对较小，因为有些虚拟机会占用更多的 CPU 和内存，有些则不会，所以并不是意味着虚拟机越多，其占用的性能也就越多。因此，在**权重**分配上，我让`numVM`占50%，别的则占 100%，最终相加即是结果。结果越小的说明该主机的负荷越小，就应该把该虚拟机迁移过去。

通过在 OpenNebula 网站中查看，可以知道学校有 9 个 Host，并且**名称和HOSTID**的数字并不是一样的，所以需要自己手动设置。

```java
double[] host1 = new double[5];
double[] host2 = new double[5];
double[] host3 = new double[5];
double[] host4 = new double[5];

double[] host5 = new double[5];
double[] host6 = new double[5];
double[] host7 = new double[5];
double[] host8 = new double[5];
double[] host9 = new double[5];

for(HOSTPERF h: arrHost)
{
    switch(h.HOSTID){
        case 6:
            host1 = new double[]{h.HOSTID, h.HostCpuUsage, h.HostMemUsage, h.HostDiskUsage, h.NumVM};
        case 7:
            host2 = new double[]{h.HOSTID, h.HostCpuUsage, h.HostMemUsage, h.HostDiskUsage, h.NumVM};
        case 9:
            host3 = new double[]{h.HOSTID, h.HostCpuUsage, h.HostMemUsage, h.HostDiskUsage, h.NumVM};
        case 21:
            host4 = new double[]{h.HOSTID, h.HostCpuUsage, h.HostMemUsage, h.HostDiskUsage, h.NumVM};
        case 20:
            host5 = new double[]{h.HOSTID, h.HostCpuUsage, h.HostMemUsage, h.HostDiskUsage, h.NumVM};
        case 19:
            host6 = new double[]{h.HOSTID, h.HostCpuUsage, h.HostMemUsage, h.HostDiskUsage, h.NumVM};
        case 11:
            host7 = new double[]{h.HOSTID, h.HostCpuUsage, h.HostMemUsage, h.HostDiskUsage, h.NumVM};
        case 10:
            host8 = new double[]{h.HOSTID, h.HostCpuUsage, h.HostMemUsage, h.HostDiskUsage, h.NumVM};
        case 1:
            host9 = new double[]{h.HOSTID, h.HostCpuUsage, h.HostMemUsage, h.HostDiskUsage, h.NumVM};
    }
}
```

然后按照上文所说一样，利用权重计算负荷值，通过交换找到最小的负荷值以及其对应的 HOSTID。

```java
public static double getTotal(double[] a){
    double sum = 0;

    sum = a[1] + a[2] + a[3] + (a[4] * 0.5);
    return sum;
}

public static int findSuitable(double[] a){
    double min = 1000.0;
    int result = 0;

    for(int i = 0; i < a.length; i++){
        if(a[i] < min){
            min = a[i];
            result = i;
            System.out.println(min + "\t" + i);
        }
    }

    return result;
}
```

这样就能找出负荷最低的主机 ID，然后将该虚拟机迁移过去即可。

