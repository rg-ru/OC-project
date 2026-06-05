import UIKit

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = OrthodoxWebViewController()
        window.tintColor = UIColor(red: 0.0, green: 0.48, blue: 1.0, alpha: 1.0)
        self.window = window
        window.makeKeyAndVisible()
    }
}
