import UIKit
import WebKit

final class OrthodoxWebViewController: UIViewController {
    private let appURL = URL(string: "https://rg-ru.github.io/OC-project/?app=ios")!
    private var webView: WKWebView!
    private let progressView = UIProgressView(progressViewStyle: .bar)
    private let messageView = UIView()
    private let messageLabel = UILabel()
    private let retryButton = UIButton(type: .system)

    override func loadView() {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = true
        configuration.websiteDataStore = .default()
        if #available(iOS 14.0, *) {
            configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        }

        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.allowsBackForwardNavigationGestures = true
        webView.customUserAgent = "OrthodoxCompanioniOS/1.0"
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        configureProgressView()
        configureMessageView()
        loadApp()
    }

    deinit {
        webView.removeObserver(self, forKeyPath: #keyPath(WKWebView.estimatedProgress))
    }

    override func observeValue(
        forKeyPath keyPath: String?,
        of object: Any?,
        change: [NSKeyValueChangeKey: Any]?,
        context: UnsafeMutableRawPointer?
    ) {
        guard keyPath == #keyPath(WKWebView.estimatedProgress) else { return }
        progressView.progress = Float(webView.estimatedProgress)
        progressView.isHidden = webView.estimatedProgress >= 1.0
    }

    private func configureProgressView() {
        progressView.translatesAutoresizingMaskIntoConstraints = false
        progressView.progressTintColor = view.tintColor
        progressView.trackTintColor = UIColor.systemFill
        progressView.isHidden = true
        view.addSubview(progressView)
        webView.addObserver(self, forKeyPath: #keyPath(WKWebView.estimatedProgress), options: .new, context: nil)

        NSLayoutConstraint.activate([
            progressView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            progressView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            progressView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        ])
    }

    private func configureMessageView() {
        messageView.translatesAutoresizingMaskIntoConstraints = false
        messageView.backgroundColor = UIColor.systemBackground
        messageView.isHidden = true

        messageLabel.translatesAutoresizingMaskIntoConstraints = false
        messageLabel.textAlignment = .center
        messageLabel.numberOfLines = 0
        messageLabel.font = UIFont.preferredFont(forTextStyle: .body)
        messageLabel.textColor = UIColor.secondaryLabel

        retryButton.translatesAutoresizingMaskIntoConstraints = false
        retryButton.setTitle("Try Again", for: .normal)
        retryButton.titleLabel?.font = UIFont.preferredFont(forTextStyle: .headline)
        retryButton.addTarget(self, action: #selector(loadApp), for: .touchUpInside)

        messageView.addSubview(messageLabel)
        messageView.addSubview(retryButton)
        view.addSubview(messageView)

        NSLayoutConstraint.activate([
            messageView.topAnchor.constraint(equalTo: view.topAnchor),
            messageView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            messageView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            messageView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            messageLabel.centerYAnchor.constraint(equalTo: messageView.centerYAnchor, constant: -26),
            messageLabel.leadingAnchor.constraint(equalTo: messageView.leadingAnchor, constant: 28),
            messageLabel.trailingAnchor.constraint(equalTo: messageView.trailingAnchor, constant: -28),

            retryButton.topAnchor.constraint(equalTo: messageLabel.bottomAnchor, constant: 18),
            retryButton.centerXAnchor.constraint(equalTo: messageView.centerXAnchor),
        ])
    }

    @objc private func loadApp() {
        messageView.isHidden = true
        webView.load(URLRequest(url: appURL, cachePolicy: .returnCacheDataElseLoad, timeoutInterval: 30))
    }

    private func showError(_ message: String) {
        messageLabel.text = message
        messageView.isHidden = false
    }
}

extension OrthodoxWebViewController: WKNavigationDelegate {
    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }

        if navigationAction.targetFrame == nil {
            webView.load(navigationAction.request)
            decisionHandler(.cancel)
            return
        }

        let scheme = url.scheme?.lowercased()
        if ["tel", "mailto", "maps"].contains(scheme), UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }

        if url.host?.contains("google.com") == true, url.path.contains("/maps") {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }

        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        progressView.isHidden = false
        progressView.progress = 0
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        progressView.isHidden = true
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        showError("Orthodox Companion could not load. Please check your connection and try again.")
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        showError("Orthodox Companion could not load. Please check your connection and try again.")
    }
}

extension OrthodoxWebViewController: WKUIDelegate {
    func webView(
        _ webView: WKWebView,
        createWebViewWith configuration: WKWebViewConfiguration,
        for navigationAction: WKNavigationAction,
        windowFeatures: WKWindowFeatures
    ) -> WKWebView? {
        if navigationAction.targetFrame == nil {
            webView.load(navigationAction.request)
        }
        return nil
    }
}
