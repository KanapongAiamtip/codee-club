import java.util.Scanner;

class MiniTest1Q2 {

    public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
        String a = sc.nextLine();
        String b = sc.nextLine();
        if (a.length() == b.length()) {
            System.out.println("EQUAL");
        }
        else {
            System.out.println("NOT EQUAL");
        }
    }
}
